package com.template.model

data class AuthRequestModel (
        val uid : String,
        val message : String,
        val signature : String,
        val personalDataAuth: Boolean,
        val contactDataAuth: Boolean,
        val financialDataAuth: Boolean
)