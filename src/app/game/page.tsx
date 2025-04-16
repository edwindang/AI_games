import { redirect } from "next/navigation"

// Redirect /game to the home page since the game is now on the home page
export default function GamePage() {
  redirect("/")
}
