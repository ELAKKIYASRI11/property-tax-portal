package com.vem.taxportal.models;

public class ExemptionItem {
    private String name;
    private Integer percentage;
    private Integer amount;

    public ExemptionItem() {}

    public ExemptionItem(String name, Integer percentage, Integer amount) {
        this.name = name;
        this.percentage = percentage;
        this.amount = amount;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPercentage() { return percentage; }
    public void setPercentage(Integer percentage) { this.percentage = percentage; }

    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
}
