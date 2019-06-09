package com.template.model

data class AuthRequestModel (
        val uid : String,
        val message : String,
        val signature : String,
        val personalDataAuth: String,
        val contactDataAuth: String,
        val financialDataAuth: String
)