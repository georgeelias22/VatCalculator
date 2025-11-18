import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, PoundSterling, Percent, Plus, Minus, RefreshCw, Copy, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { type Calculation, defaultVATRates } from "@shared/schema";
import { cn } from "@/lib/utils";

export function VATCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [vatRate, setVatRate] = useState<number>(20);
  const [customVatRate, setCustomVatRate] = useState<string>("");
  const [calculationType, setCalculationType] = useState<"add" | "remove">("add");
  const [inputError, setInputError] = useState<string>("");
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [theme, toggleTheme] = useTheme();
  const { toast } = useToast();

  const isCustomRate = vatRate === -1;
  const effectiveVatRate = isCustomRate ? parseFloat(customVatRate) || 0 : vatRate;

  useEffect(() => {
    calculateVAT();
  }, [amount, effectiveVatRate, calculationType]);

  const validateAmount = (value: string): boolean => {
    setInputError("");
    
    if (!value.trim()) {
      return false;
    }

    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setInputError("Please enter a valid number");
      return false;
    }
    
    if (numValue < 0) {
      setInputError("Amount cannot be negative");
      return false;
    }
    
    if (numValue > 999999999) {
      setInputError("Amount is too large");
      return false;
    }

    return true;
  };

  const calculateVAT = () => {
    if (!validateAmount(amount) || effectiveVatRate < 0) {
      setCalculation(null);
      return;
    }

    const originalAmount = parseFloat(amount);
    let vatAmount: number;
    let finalAmount: number;

    if (calculationType === "add") {
      vatAmount = (originalAmount * effectiveVatRate) / 100;
      finalAmount = originalAmount + vatAmount;
    } else {
      // Remove VAT: if final amount includes VAT, find original
      finalAmount = originalAmount / (1 + effectiveVatRate / 100);
      vatAmount = originalAmount - finalAmount;
    }

    const newCalculation: Calculation = {
      originalAmount,
      vatRate: effectiveVatRate,
      calculationType,
      vatAmount,
      finalAmount,
      timestamp: Date.now(),
    };

    setCalculation(newCalculation);
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    setAmount(cleanValue);
  };

  const handleVatRateChange = (value: string) => {
    if (value === "custom") {
      setVatRate(-1);
    } else {
      setVatRate(parseFloat(value));
    }
  };

  const clearCalculation = () => {
    setAmount("");
    setCustomVatRate("");
    setVatRate(20);
    setCalculationType("add");
    setInputError("");
    setCalculation(null);
  };

  const copyResult = async () => {
    if (!calculation) return;

    try {
      await navigator.clipboard.writeText(calculation.finalAmount.toFixed(2));
      toast({
        title: "Success",
        description: "Result copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="title-app">
            VAT Calculator
          </h1>
          <p className="text-muted-foreground" data-testid="text-description">
            Calculate VAT inclusive or exclusive amounts
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            
            {/* Amount Input */}
            <div className="mb-6">
              <Label htmlFor="amount" className="flex items-center text-sm font-medium text-foreground mb-2">
                <PoundSterling className="mr-2 h-4 w-4 text-primary" />
                Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="text-lg pr-16 font-mono"
                  data-testid="input-amount"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground text-sm">GBP</span>
                </div>
              </div>
              <div className="text-destructive text-sm mt-1 min-h-[20px]" data-testid="text-error">
                {inputError}
              </div>
            </div>

            {/* VAT Rate Config */}
            <div className="mb-6">
              <Label className="flex items-center text-sm font-medium text-foreground mb-2">
                <Percent className="mr-2 h-4 w-4 text-primary" />
                VAT Rate
              </Label>
              <Select value={isCustomRate ? "custom" : vatRate.toString()} onValueChange={handleVatRateChange}>
                <SelectTrigger data-testid="select-vat-rate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultVATRates.map((rate) => (
                    <SelectItem key={rate.rate} value={rate.rate.toString()}>
                      {rate.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Rate</SelectItem>
                </SelectContent>
              </Select>
              
              {isCustomRate && (
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Enter custom rate"
                    value={customVatRate}
                    onChange={(e) => setCustomVatRate(e.target.value)}
                    step="0.01"
                    min="0"
                    max="100"
                    data-testid="input-custom-vat-rate"
                  />
                </div>
              )}
            </div>

            {/* Calculation Toggle */}
            <div className="mb-6">
              <Label className="flex items-center text-sm font-medium text-foreground mb-3">
                <Calculator className="mr-2 h-4 w-4 text-primary" />
                Calculation Type
              </Label>
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={calculationType === "add" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCalculationType("add")}
                  className={cn(
                    "flex-1 transition-all duration-200",
                    calculationType === "add" 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="button-add-vat"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add VAT
                </Button>
                <Button
                  variant={calculationType === "remove" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCalculationType("remove")}
                  className={cn(
                    "flex-1 transition-all duration-200",
                    calculationType === "remove" 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="button-remove-vat"
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Remove VAT
                </Button>
              </div>
            </div>

            {/* Calculation Display */}
            {calculation && (
              <div className="bg-muted rounded-lg p-4 mb-6" data-testid="section-calculation-display">
                <h3 className="text-sm font-medium text-foreground mb-3">Calculation Breakdown</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Amount:</span>
                    <span className="font-mono" data-testid="text-original-amount">
                      {formatCurrency(calculation.originalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      VAT ({effectiveVatRate}%):
                    </span>
                    <span className={cn(
                      "font-mono",
                      calculationType === "add" ? "text-primary" : "text-destructive"
                    )} data-testid="text-vat-amount">
                      {calculationType === "add" ? "+" : "-"}{formatCurrency(calculation.vatAmount)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-lg font-mono" data-testid="text-final-amount">
                        {formatCurrency(calculation.finalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={clearCalculation}
                className="font-medium"
                data-testid="button-clear"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button
                onClick={copyResult}
                disabled={!calculation}
                className="font-medium"
                data-testid="button-copy"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Result
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-toggle-theme"
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Toggle {theme === "light" ? "Dark" : "Light"} Mode
          </Button>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>UK VAT rates apply. For business use, consult your accountant.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
