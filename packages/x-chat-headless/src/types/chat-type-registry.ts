// Consumers can augment this module to add app-specific user metadata.
export interface ChatUserMetadata {}

// Consumers can augment this module to add app-specific conversation metadata.
export interface ChatConversationMetadata {}

// Consumers can augment this module to add app-specific message metadata.
export interface ChatMessageMetadata {}

// Consumers can augment this module to register custom message parts.
export interface ChatCustomMessagePartMap {}

// Consumers can augment this module to register typed tool definitions.
export interface ChatToolDefinitionMap {}

// Consumers can augment this module to register typed data parts.
export interface ChatDataPartMap {}
