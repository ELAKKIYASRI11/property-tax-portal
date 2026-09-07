package com.vem.taxportal.controllers;

import com.vem.taxportal.models.Notification;
import com.vem.taxportal.models.User;
import com.vem.taxportal.repositories.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(user.getId());

        return ResponseEntity.ok(Map.of(
                "notifications", notifications,
                "unreadCount", unreadCount
        ));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        User user = getAuthenticatedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        if ("all".equalsIgnoreCase(id)) {
            List<Notification> unreadList = notificationRepository.findByUserIdAndIsReadFalse(user.getId());
            for (Notification n : unreadList) {
                n.setIsRead(true);
            }
            notificationRepository.saveAll(unreadList);
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        }

        try {
            Long notificationId = Long.parseLong(id);
            Optional<Notification> notifOpt = notificationRepository.findById(notificationId);
            if (notifOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Notification not found"));
            }

            Notification notification = notifOpt.get();
            if (!Objects.equals(notification.getUser().getId(), user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized"));
            }

            notification.setIsRead(true);
            Notification saved = notificationRepository.save(notification);

            return ResponseEntity.ok(saved);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid notification ID"));
        }
    }
}
