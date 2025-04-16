import { redirect } from "next/navigation"

// Redirect /tictactoe to /game for compatibility
export default function TicTacToePage() {
  redirect("/game")
}
