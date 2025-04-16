"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TreeNode = {
  board: string[][]
  score: number | null
  children: TreeNode[]
  move: [number, number] | null
  isOptimal: boolean
  depth: number
}

type DecisionTreeProps = {
  board: string[][]
  aiSymbol: string
  playerSymbol: string
  difficulty: string
  isAiThinking: boolean
  lastMove: [number, number] | null
}

export default function DecisionTree({
  board,
  aiSymbol,
  playerSymbol,
  difficulty,
  isAiThinking,
  lastMove,
}: DecisionTreeProps) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null)
  const [moveHistory, setMoveHistory] = useState<Array<{ move: string; time: number; evaluation: number }>>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [showingDepth, setShowingDepth] = useState(1)
  const startTimeRef = useRef<number | null>(null)

  // Generate a simplified decision tree for visualization
  useEffect(() => {
    if (isAiThinking && lastMove !== null) {
      startTimeRef.current = performance.now()

      // Clear previous tree when AI starts thinking
      setTreeData(null)

      // Generate the decision tree (limited depth for visualization)
      const maxDepth = difficulty === "random" ? 1 : difficulty === "h-minimax" ? 2 : 3
      const tree = generateDecisionTree(board, aiSymbol, playerSymbol, maxDepth)
      setTreeData(tree)

      // Expand the root node by default
      if (tree) {
        setExpandedNodes(new Set(["0-0"]))
      }
    }
  }, [isAiThinking, board, aiSymbol, playerSymbol, difficulty, lastMove])

  // Add to move history when AI makes a move
  useEffect(() => {
    if (!isAiThinking && lastMove !== null && startTimeRef.current !== null) {
      const elapsedTime = (performance.now() - startTimeRef.current) / 1000
      const moveNotation = `${aiSymbol}@${String.fromCharCode(97 + lastMove[1])}${lastMove[0]}`

      // Find the evaluation score from the tree if available
      let evaluation = 0
      if (treeData) {
        const optimalChild = treeData.children.find(
          (child) => child.move && child.move[0] === lastMove[0] && child.move[1] === lastMove[1],
        )
        evaluation = optimalChild?.score || 0
      }

      setMoveHistory((prev) => [
        ...prev,
        {
          move: moveNotation,
          time: elapsedTime,
          evaluation,
        },
      ])
    }
  }, [isAiThinking, lastMove, aiSymbol, treeData])

  // Generate a decision tree for visualization purposes
  const generateDecisionTree = (
    currentBoard: string[][],
    currentPlayer: string,
    opponent: string,
    maxDepth: number,
    depth = 0,
    move: [number, number] | null = null,
  ): TreeNode => {
    // Create a copy of the board
    const boardCopy = currentBoard.map((row) => [...row])

    // Apply the move if provided
    if (move) {
      boardCopy[move[0]][move[1]] = depth % 2 === 0 ? opponent : currentPlayer
    }

    // Check terminal states
    const isWin = checkWin(boardCopy, currentPlayer)
    const isLoss = checkWin(boardCopy, opponent)
    const isTie = checkTie(boardCopy)

    // Calculate score for terminal states
    let score: number | null = null
    if (isWin) {
      score = 10 - depth
    } else if (isLoss) {
      score = depth - 10
    } else if (isTie) {
      score = 0
    }

    // Create node
    const node: TreeNode = {
      board: boardCopy,
      score,
      children: [],
      move,
      isOptimal: false,
      depth,
    }

    // Stop recursion at terminal states or max depth
    if (isWin || isLoss || isTie || depth >= maxDepth) {
      return node
    }

    // Get available moves
    const availableMoves = getAvailableMoves(boardCopy)

    // Generate children
    const nextPlayer = depth % 2 === 0 ? currentPlayer : opponent
    const nextOpponent = depth % 2 === 0 ? opponent : currentPlayer

    for (const nextMove of availableMoves) {
      const childNode = generateDecisionTree(boardCopy, nextPlayer, nextOpponent, maxDepth, depth + 1, nextMove)
      node.children.push(childNode)
    }

    // For visualization, calculate scores for non-terminal nodes
    if (score === null && node.children.length > 0) {
      if (depth % 2 === 0) {
        // Maximizing player
        score = Math.max(...node.children.map((child) => child.score || Number.NEGATIVE_INFINITY))
        // Mark optimal path
        const optimalChild = node.children.find((child) => child.score === score)
        if (optimalChild) optimalChild.isOptimal = true
      } else {
        // Minimizing player
        score = Math.min(...node.children.map((child) => child.score || Number.POSITIVE_INFINITY))
        // Mark optimal path
        const optimalChild = node.children.find((child) => child.score === score)
        if (optimalChild) optimalChild.isOptimal = true
      }
      node.score = score
    }

    return node
  }

  // Helper functions
  const checkWin = (board: string[][], player: string): boolean => {
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

  const checkTie = (board: string[][]): boolean => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          return false
        }
      }
    }
    return true
  }

  const getAvailableMoves = (board: string[][]): Array<[number, number]> => {
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

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  // Render a mini board for visualization
  const renderMiniBoard = (board: string[][], highlight: [number, number] | null = null) => {
    return (
      <div className="grid grid-cols-3 gap-[2px] w-12 h-12">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                flex items-center justify-center text-xs font-bold
                border border-gray-300
                ${
                  highlight && highlight[0] === rowIndex && highlight[1] === colIndex
                    ? "bg-yellow-200"
                    : cell
                      ? "bg-gray-100"
                      : "bg-white"
                }
              `}
            >
              {cell}
            </div>
          )),
        )}
      </div>
    )
  }

  // Render a tree node
  const renderTreeNode = (node: TreeNode, nodeId = "0-0") => {
    const isExpanded = expandedNodes.has(nodeId)

    return (
      <div className="ml-2 mt-2 border-l-2 border-gray-200 pl-2">
        <div
          className={`
            flex items-center gap-2 p-1 rounded-md cursor-pointer
            ${node.isOptimal ? "bg-green-50 border border-green-200" : ""}
            ${node.depth <= showingDepth ? "block" : "hidden"}
          `}
          onClick={() => toggleNode(nodeId)}
        >
          {renderMiniBoard(node.board, node.move)}

          <div className="flex flex-col">
            <div className="flex items-center gap-1 flex-wrap">
              {node.move && (
                <Badge variant="outline" className="text-xs">
                  {`${node.depth % 2 === 0 ? playerSymbol : aiSymbol}@${String.fromCharCode(97 + node.move[1])}${node.move[0]}`}
                </Badge>
              )}

              {node.score !== null && (
                <Badge
                  variant={node.score > 0 ? "success" : node.score < 0 ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {node.score}
                </Badge>
              )}

              <Badge variant="secondary" className="text-xs">
                D{node.depth}
              </Badge>
            </div>

            {node.children.length > 0 && (
              <span className="text-xs text-gray-500 mt-1">{isExpanded ? "▼" : `▶ ${node.children.length}`}</span>
            )}
          </div>
        </div>

        {isExpanded && node.children.length > 0 && (
          <div className="ml-1">
            {node.children.map((child, index) => (
              <div key={index}>{renderTreeNode(child, `${nodeId}-${index}`)}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // If AI is using random moves, show a simplified visualization
  const renderRandomDecision = () => {
    return (
      <div className="p-4 text-center">
        <div className="mb-4">
          <div className="inline-block p-3 rounded-full bg-gray-100 animate-pulse">
            <div className="w-16 h-16 flex items-center justify-center">
              <span className="text-2xl">🎲</span>
            </div>
          </div>
        </div>
        <p>Random AI is selecting a move...</p>
        <p className="text-sm text-gray-500 mt-2">This AI simply chooses a random available position on the board.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        {difficulty !== "random" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal">Depth:</span>
            <select
              className="text-sm border rounded p-1"
              value={showingDepth}
              onChange={(e) => setShowingDepth(Number(e.target.value))}
            >
              {[1, 2, 3].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="tree" className="flex-1">
            Decision Tree
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Move History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tree">
          {isAiThinking && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm flex items-center">
                <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                AI is thinking...
              </p>
            </div>
          )}

          <div className="overflow-auto">
            {difficulty === "random" ? (
              renderRandomDecision()
            ) : treeData ? (
              <div className="relative">{renderTreeNode(treeData)}</div>
            ) : (
              <p className="text-center text-gray-500 py-8">Make a move to see the AI's decision process</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          {moveHistory.length > 0 ? (
            <div className="space-y-2">
              {moveHistory.map((move, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{move.move}</Badge>
                    <span className="text-sm text-gray-500">{move.time.toFixed(3)}s</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Evaluation: </span>
                    <span
                      className={move.evaluation > 0 ? "text-green-600" : move.evaluation < 0 ? "text-red-600" : ""}
                    >
                      {move.evaluation > 0 ? "+" : ""}
                      {move.evaluation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No moves recorded yet</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
