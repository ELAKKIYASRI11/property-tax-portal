package com.vem.taxportal.models;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class BreakdownSnapshotConverter implements AttributeConverter<BreakdownSnapshot, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(BreakdownSnapshot attribute) {
        if (attribute == null) return null;
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize BreakdownSnapshot", e);
        }
    }

    @Override
    public BreakdownSnapshot convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) return null;
        try {
            return objectMapper.readValue(dbData, BreakdownSnapshot.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not deserialize BreakdownSnapshot", e);
        }
    }
}
