import { ChatClient } from "./chatClient";
import { EmbedBuilder } from "./embedBuilder";

export type { ChatClient } from "./chatClient";
export type { EmbedBuilder, UrlParams } from "./embedBuilder";
export type { EmbedClient } from "./embed";
export * from "./types";

export class PixellandChat {
  static embedChat(apiHost: string) {
    PixellandChat.apiHost = apiHost;
    return new EmbedBuilder<ChatClient>(this, ChatClient).withUrl(
      "/src/chat/dist/index.html"
    );
  }

  static apiHost: string;
}
