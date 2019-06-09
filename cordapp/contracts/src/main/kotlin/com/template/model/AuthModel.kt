package com.template.model

import net.corda.core.identity.Party
import net.corda.core.serialization.CordaSerializable
import java.time.Instant

@CordaSerializable
data class AuthModel(
         val entity : Party,
         val message: String,
         val signature: String
)
