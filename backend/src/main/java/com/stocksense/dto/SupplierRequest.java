package com.stocksense.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SupplierRequest {

    @NotBlank(message = "is required")
    @Size(max = 100, message = "must not exceed 100 characters")
    private String name;

    @Email(message = "must be valid")
    @Size(max = 100, message = "must not exceed 100 characters")
    private String email;

    @Size(max = 20, message = "must not exceed 20 characters")
    private String phone;

    @Size(max = 255, message = "must not exceed 255 characters")
    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
