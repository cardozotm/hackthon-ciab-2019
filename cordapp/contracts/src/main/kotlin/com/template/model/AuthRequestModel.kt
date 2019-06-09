package com.template.model

data class IdentityRequestModel (
        val uid : String,
        val pubkey : String,
        val personalData: String,
        val contactData: String,
        val financialData: String
)