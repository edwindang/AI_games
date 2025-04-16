"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DecisionTree from "@/components/decision-tree"

// Game board type
type Board = Array<Array<string>>

// Create an empty board
const createEmptyBoard = (): Board => {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(""))
}

// Check if a player has won
const checkWin = (board: Board, player: string): boolean => {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      return true
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      return true
    }
  }

  // Check diagonals
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true
  }

  return false
}

// Check if the game is a tie
const checkTie = (board: Board): boolean => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        return false
      }
    }
  }
  return true
}

// Get available moves
const getAvailableMoves = (board: Board): Array<[number, number]> => {
  const moves: Array<[number, number]> = []
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        moves.push([i, j])
      }
    }
  }
  return moves
}

// Minimax algorithm for AI
const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  player: string,
  opponent: string,
  alpha = Number.NEGATIVE_INFINITY,
  beta: number = Number.POSITIVE_INFINITY,
  useAlphaBeta = true,
): number => {
  // Check if player has won
  if (checkWin(board, player)) {
    return 10 - depth
  }

  // Check if opponent has won
  if (checkWin(board, opponent)) {
    return depth - 10
  }

  // Check if it's a tie
  if (checkTie(board)) {
    return 0
  }

  const availableMoves = getAvailableMoves(board)

  if (isMaximizing) {
    let bestScore = Number.NEGATIVE_INFINITY
    for (const [i, j] of availableMoves) {
      board[i][j] = player
      const score = minimax(board, depth + 1, false, player, opponent, alpha, beta, useAlphaBeta)
      board[i][j] = ""
      bestScore = Math.max(score, bestScore)

      if (useAlphaBeta) {
        alpha = Math.max(alpha, bestScore)
        if (beta <= alpha) {
          break
        }
      }
    }
    return bestScore
  } else {
    let bestScore = Number.POSITIVE_INFINITY
    for (const [i, j] of availableMoves) {
      board[i][j] = opponent
      const score = minimax(board, depth + 1, true, player, opponent, alpha, beta, useAlphaBeta)
      board[i][j] = ""
      bestScore = Math.min(score, bestScore)

      if (useAlphaBeta) {
        beta = Math.min(beta, bestScore)
        if (beta <= alpha) {
          break
        }
      }
    }
    return bestScore
  }
}

// AI move function
const findBestMove = (board: Board, player: string, opponent: string, difficulty: string): [number, number] => {
  // Random move
  if (difficulty === "random") {
    const availableMoves = getAvailableMoves(board)
    const randomIndex = Math.floor(Math.random() * availableMoves.length)
    return availableMoves[randomIndex]
  }

  // Minimax move
  const useAlphaBeta = difficulty === "minimax-alpha-beta" || difficulty === "h-minimax"
  const availableMoves = getAvailableMoves(board)
  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove: [number, number] = [-1, -1]

  // For h-minimax with fixed depth cutoff
  const maxDepth = difficulty === "h-minimax" ? 2 : Number.POSITIVE_INFINITY

  for (const [i, j] of availableMoves) {
    board[i][j] = player
    const score = minimax(
      board,
      0,
      false,
      player,
      opponent,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      useAlphaBeta,
    )
    board[i][j] = ""

    if (score > bestScore) {
      bestScore = score
      bestMove = [i, j]
    }
  }

  return bestMove
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X")
  const [aiSymbol, setAiSymbol] = useState<"X" | "O">("O")
  const [currentPlayer, setCurrentPlayer] = useState<"player" | "ai">("player")
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "tie">("playing")
  const [difficulty, setDifficulty] = useState<string>("random")
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false)
  const [lastMove, setLastMove] = useState<[number, number] | null>(null)

  // Handle player move
  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== "" || currentPlayer !== "player" || gameStatus !== "playing") {
      return
    }

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = playerSymbol
    setLastMove([row, col])
    setBoard(newBoard)

    // Check if player won or if it's a tie
    if (checkWin(newBoard, playerSymbol)) {
      setGameStatus("won")
      return
    }

    if (checkTie(newBoard)) {
      setGameStatus("tie")
      return
    }

    setCurrentPlayer("ai")
    setIsAiThinking(true)
  }

  // AI move
  useEffect(() => {
    if (currentPlayer === "ai" && gameStatus === "playing") {
      const timer = setTimeout(() => {
        const newBoard = [...board.map((row) => [...row])]
        const [row, col] = findBestMove(newBoard, aiSymbol, playerSymbol, difficulty)

        newBoard[row][col] = aiSymbol
        setLastMove([row, col])
        setBoard(newBoard)
        setIsAiThinking(false)

        // Check if AI won or if it's a tie
        if (checkWin(newBoard, aiSymbol)) {
          setGameStatus("lost")
          return
        }

        if (checkTie(newBoard)) {
          setGameStatus("tie")
          return
        }

        setCurrentPlayer("player")
      }, 1000) // Longer delay to show the AI "thinking"

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, board, aiSymbol, playerSymbol, difficulty, gameStatus])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStarted && gameStatus === "playing") {
      if (!startTime) {
        setStartTime(Date.now())
      }

      interval = setInterval(() => {
        if (startTime) {
          setElapsedTime((Date.now() - startTime) / 1000)
        }
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameStatus, startTime])

  // Start a new game
  const startGame = () => {
    setBoard(createEmptyBoard())
    setGameStatus("playing")
    setCurrentPlayer(playerSymbol === "X" ? "player" : "ai")
    setGameStarted(true)
    setStartTime(Date.now())
    setElapsedTime(0)
    setIsAiThinking(playerSymbol === "O")
    setLastMove(null)
  }

  // Switch player symbol
  const handleSymbolChange = (value: "X" | "O") => {
    setPlayerSymbol(value)
    setAiSymbol(value === "X" ? "O" : "X")
  }

  return (
    <div className="flex flex-col items-center w-full">
      {!gameStarted ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Choose your symbol:</h3>
              <RadioGroup
                defaultValue={playerSymbol}
                onValueChange={(value) => handleSymbolChange(value as "X" | "O")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="X" id="symbol-x" />
                  <Label htmlFor="symbol-x">X (goes first)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="O" id="symbol-o" />
                  <Label htmlFor="symbol-o">O (goes second)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Choose AI difficulty:</h3>
              <RadioGroup defaultValue={difficulty} onValueChange={setDifficulty} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="random" id="difficulty-random" />
                  <Label htmlFor="difficulty-random">Random moves</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimax" id="difficulty-minimax" />
                  <Label htmlFor="difficulty-minimax">Minimax (unbeatable)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimax-alpha-beta" id="difficulty-alpha-beta" />
                  <Label htmlFor="difficulty-alpha-beta">Minimax with alpha-beta pruning (faster)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="h-minimax" id="difficulty-h-minimax" />
                  <Label htmlFor="difficulty-h-minimax">H-Minimax with depth cutoff (easier)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="w-full max-w-6xl">
          {/* Side-by-side layout for larger screens, stacked for mobile */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Game board section */}
            <div className="w-full lg:w-1/2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-xl">
                    <span>Tic-Tac-Toe Game</span>
                    <span className="text-sm font-normal">Time: {elapsedTime.toFixed(1)}s</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="font-medium">You: {playerSymbol}</span> vs{" "}
                      <span className="font-medium">AI: {aiSymbol}</span>
                    </div>
                    <div>
                      <span className="text-sm">{currentPlayer === "player" ? "Your turn" : "AI's turn"}</span>
                    </div>
                  </div>

                  {gameStatus !== "playing" && (
                    <Alert
                      className="mb-4"
                      variant={gameStatus === "won" ? "default" : gameStatus === "lost" ? "destructive" : "default"}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>
                        {gameStatus === "won" ? "You won!" : gameStatus === "lost" ? "AI won!" : "It's a tie!"}
                      </AlertTitle>
                      <AlertDescription>
                        {gameStatus === "won"
                          ? "Congratulations! You beat the AI."
                          : gameStatus === "lost"
                            ? "The AI outsmarted you this time."
                            : "No winner this time."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            w-full aspect-square flex items-center justify-center text-3xl font-bold
                            border-2 border-gray-300 rounded-md transition-colors
                            ${cell ? "bg-gray-100" : "hover:bg-gray-50"}
                            ${gameStatus !== "playing" ? "cursor-not-allowed" : "cursor-pointer"}
                          `}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          disabled={gameStatus !== "playing" || currentPlayer !== "player"}
                        >
                          {cell}
                        </button>
                      )),
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGameStarted(false)
                        setBoard(createEmptyBoard())
                        setGameStatus("playing")
                      }}
                    >
                      Change Settings
                    </Button>
                    <Button onClick={startGame}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      New Game
                    </Button>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      AI difficulty:{" "}
                      {difficulty === "random"
                        ? "Random moves"
                        : difficulty === "minimax"
                          ? "Minimax"
                          : difficulty === "minimax-alpha-beta"
                            ? "Minimax with alpha-beta pruning"
                            : "H-Minimax with depth cutoff"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Decision tree section */}
            <div className="w-full lg:w-1/2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">AI Decision Process</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] overflow-auto">
                  <DecisionTree
                    board={board}
                    aiSymbol={aiSymbol}
                    playerSymbol={playerSymbol}
                    difficulty={difficulty}
                    isAiThinking={isAiThinking}
                    lastMove={lastMove}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
