export interface ConnectUserRequest {
  avatar: string
  name: string
  bio: string
  token: string
  verified?: boolean
}

export interface SetInstanceReqeuest {
  instanceId: string
  token: string
  verified?: boolean
}

export interface ViewInviteRequest {
  code: string
}

export interface SetVisibilityRequest {
  visible: boolean
}

export interface SetTokenRequest {
  token: string
  verified?: boolean
}
