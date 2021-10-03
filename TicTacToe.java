package tic_tac_toe;
import java.util.*;

public class TicTacToe {

	
	static int player;
	String opponent;
	
	public static void printNineBoard(Board[][] nineboard) {
		for (int i = 0; i<nineboard.length; i++) {
			LinkedList<Board> templist = new LinkedList<Board>();
			for (int j = 0; j<nineboard.length; j++) {
				templist.add(nineboard[i][j]);
			}
			System.out.println("   a   b   c" +  "   a   b   c" + "   a   b   c");
			System.out.println("0  " + templist.get(0).map[0][0] + " | " + templist.get(0).map[0][1] + " | " + templist.get(0).map[0][2] + "0  " + templist.get(1).map[0][0] + " | " + templist.get(1).map[0][1] + " | " + templist.get(1).map[0][2] + "2  " + templist.get(2).map[0][0] + " | " + templist.get(2).map[0][1] + " | " + templist.get(2).map[0][2]);
			System.out.println("  ---+---+---" + "  ---+---+---" + "  ---+---+---");
			System.out.println("1  " + templist.get(0).map[1][0] + " | " + templist.get(0).map[1][1] + " | " + templist.get(0).map[1][2] + "1  " + templist.get(1).map[1][0] + " | " + templist.get(1).map[1][1] + " | " + templist.get(1).map[1][2] + "2  " + templist.get(2).map[1][0] + " | " + templist.get(2).map[1][1] + " | " + templist.get(2).map[1][2]);
			System.out.println("  ---+---+---" + "  ---+---+---" + "  ---+---+---");
			System.out.println("2  " + templist.get(0).map[2][0] + " | " + templist.get(0).map[2][1] + " | " + templist.get(0).map[2][2] + "2  " + templist.get(1).map[2][0] + " | " + templist.get(1).map[2][1] + " | " + templist.get(1).map[2][2] + "2  " + templist.get(2).map[2][0] + " | " + templist.get(2).map[2][1] + " | " + templist.get(2).map[2][2]);
		}
	}
	
	public static void main(String[] args) throws CloneNotSupportedException {
		char winner = 0;
		int x_val;
		int y_val;
		boolean play = true;
		int moves = 0;
		
		Scanner s = new Scanner(System.in);
		String opponent;
		System.out.println("Choose your game:\n1. Basic Tic-Tac-Toe\n2. Nine-board Tic-Tac-Toe");
		System.out.println("Your choice? ");
		String game = s.nextLine();
		System.out.println("Choose your opponent:\n1. An agent that plays randomly\n2. An agent that uses MINIMAX");
		System.out.println("3. An agent that uses MINIMAX with alpha-beta pruning");
		System.out.println("4. An agent that uses H-MINIMAX with alpha-beta and a fixed depth cutoff\nYour choice? ");
		String agent = s.nextLine();
		System.out.println("Do you want to play X or O? ");
		String x = s.nextLine();
		x = x.toUpperCase();
		if (x.compareTo("X") == 0) {
			opponent = "O";
			player = 1;
		}
		else {
			opponent = "X";
			player = 0;
		}
		Opponent op = new Opponent(Integer.valueOf(agent));
		if (game.compareTo("1") == 0) {
			Board gameboard = new Board();
			gameboard.printBoard();
			while (play) {
				if (player == 1) {
					System.out.println("Next to play:" + x.toUpperCase());
					System.out.println("Your move [col row]? ");
					Stopwatch timer = new Stopwatch();
					String movement = s.nextLine();
					char let = movement.charAt(0);
					char num = movement.charAt(1);
					x_val = let - 97;
					y_val = Integer.parseInt(String.valueOf(num));
					ArrayList<String> available = gameboard.availableMoves();
					if (available.contains(movement)) {
						gameboard.map[y_val][x_val] = x.charAt(0);
					}
					else {
						System.out.println("Invalid move, try again");
						continue;
					}
					System.out.println(x+ "@" + movement);
					System.out.println();
					System.out.println("Elapsed time: " + timer.elapsedTime() + " secs");
					gameboard.printBoard();
					winner = gameboard.checkWin(gameboard);
					if (winner == 'n') {
						;
					}
					else {
						break;
					}
				}

				else if (player == 0) {
					System.out.println("Next to play:" + opponent);
					System.out.println();
					Stopwatch watch = new Stopwatch();
					op.move(gameboard, opponent);
					System.out.println("Elapsed time: " + watch.elapsedTime() + " secs");
					gameboard.printBoard();
					winner = gameboard.checkWin(gameboard);
					if (winner == 'n') {
						;
					}
					else {
						break;
					}
				}
				player = (player+1)%2;

			}
			if (winner == 'x') {
				System.out.println("X won!");
			}
			else if (winner == 'o') {
				System.out.println("O won!");
			}
			else if (winner == 't') {
				System.out.println("Tie reached!");
			}
			System.out.println("Game Finished.");
		}
		
		else if (game.compareTo("2") == 0) {
			Board[][] nineboard = new Board[3][3];
			for (int i = 0; i<nineboard.length; i++) {
				for (int j = 0; j<nineboard.length; j++) {
					Board new_board = new Board();
					nineboard[i][j] = new_board;
				}
			}
			
			while (play) {
				if (player == 1) {
					System.out.println("Next to play:" + x.toUpperCase());
					System.out.println("Your move (<board_col, board_row>), (<col, row>)? ");
					Stopwatch timer = new Stopwatch();
					String movement = s.nextLine();
					String[] parts = movement.split(",");
					int count = 0;
					char board_let = 0, board_num = 0, let = 0, num = 0;
					for (String p : parts) {
						System.out.println("p:" + p);
						p = p.replaceAll("//s", "");
						if (count == 0) {
							System.out.println("here");
							board_let = p.charAt(0);
							System.out.println(board_let);
							board_num = p.charAt(1);
							System.out.println(board_num);

						}
						else if (count == 1) {
							System.out.println("right here");
							let = p.charAt(0);
							System.out.println(let);
							num = p.charAt(1);
							System.out.println(num);

						}
						count +=1;
					}
					int boardx = board_let - 97;
					System.out.println("x" + boardx);

					int boardy = Integer.parseInt(String.valueOf(board_num));
					System.out.println(boardy);

					int xval = let - 97;
					System.out.println(xval);

					int yval = Integer.parseInt(String.valueOf(num));
					System.out.println(yval);

					Board cur = nineboard[boardx][boardy];
					cur.map[yval][xval] = x.charAt(0);
					System.out.println(x+ "@" + movement);
					System.out.println("Elapsed time: " + timer.elapsedTime() + " secs");
					printNineBoard(nineboard);
				}
				
				else if (player == 0) {
					System.out.println("hre");
				}
				player = (player+1)%2;
			}
		}
		
	}



}
