package com.vem.taxportal.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    @Value("${jwt.secret:vem_sathyamangalam_property_tax_secret_key_2026_super_secure_key_vem_portal}")
    private String secret;

    @Value("${jwt.expiration:2592000000}")
    private long expirationMs;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(Long userId, String email, String role) {
        try {
            // Header
            Map<String, Object> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");
            String encodedHeader = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(objectMapper.writeValueAsBytes(header));

            // Payload
            long now = System.currentTimeMillis();
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", userId);
            payload.put("email", email);
            payload.put("role", role);
            payload.put("iat", now / 1000);
            payload.put("exp", (now + expirationMs) / 1000);
            String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(objectMapper.writeValueAsBytes(payload));

            // Signature
            String signature = sign(encodedHeader + "." + encodedPayload, secret);

            return encodedHeader + "." + encodedPayload + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || !token.contains(".")) return false;
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String expectedSignature = sign(parts[0] + "." + parts[1], secret);
            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                return false;
            }

            // Check expiration
            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            JsonNode node = objectMapper.readTree(payloadBytes);
            if (node.has("exp")) {
                long exp = node.get("exp").asLong();
                if (exp * 1000 < System.currentTimeMillis()) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            JsonNode node = objectMapper.readTree(payloadBytes);
            if (node.has("id")) {
                return node.get("id").asLong();
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    public String getRoleFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            JsonNode node = objectMapper.readTree(payloadBytes);
            if (node.has("role")) {
                return node.get("role").asText();
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private String sign(String data, String secretKey) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hmacBytes);
    }
}
