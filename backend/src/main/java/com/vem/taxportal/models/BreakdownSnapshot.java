package com.vem.taxportal.models;

public class BreakdownSnapshot {
    private Integer grossTax;
    private Integer exemptions;
    private Integer latePenalty;
    private Integer netPaid;

    public BreakdownSnapshot() {}

    public BreakdownSnapshot(Integer grossTax, Integer exemptions, Integer latePenalty, Integer netPaid) {
        this.grossTax = grossTax;
        this.exemptions = exemptions;
        this.latePenalty = latePenalty;
        this.netPaid = netPaid;
    }

    public Integer getGrossTax() { return grossTax; }
    public void setGrossTax(Integer grossTax) { this.grossTax = grossTax; }

    public Integer getExemptions() { return exemptions; }
    public void setExemptions(Integer exemptions) { this.exemptions = exemptions; }

    public Integer getLatePenalty() { return latePenalty; }
    public void setLatePenalty(Integer latePenalty) { this.latePenalty = latePenalty; }

    public Integer getNetPaid() { return netPaid; }
    public void setNetPaid(Integer netPaid) { this.netPaid = netPaid; }
}
