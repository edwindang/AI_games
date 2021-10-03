package tic_tac_toe;

import java.util.*;

public class Board{

	static int x;
	static int y;
	//static char[][] array = new char[3][3];
	char[][] map;
	boolean play;
	Board state;
	double value;
	double alpha = Double.NEGATIVE_INFINITY;
	double beta = Double.POSITIVE_INFINITY;
	
	public Board() {
		char[][] tempBoard = new char[3][3];
		for (int i = 0; i<tempBoard.length; i++) {
			//String letter = Character.toString(i + 97);
			for (int j = 0; j<tempBoard.length; j++) {
				tempBoard[i][j] = ' ';
			}
		}
		map = tempBoard;
	}
	
	public Board(Board old_board) {
		map = new char[3][3];
		for (int i = 0; i<old_board.map.length; i++) {
			for (int j = 0; j<old_board.map.length; j++) {
				map[i][j] = old_board.map[i][j];
			}
		}
	}
	
	public Board(char[][] old_map) {
		map = new char[3][3];
		for (int i = 0; i<old_map.length; i++) {
			for (int j = 0; j<old_map.length; j++) {
				map[i][j] = old_map[i][j];
			}
		}
	}
	
	
	
	
	public void printBoard() {
		System.out.println("   a   b   c");
		System.out.println("0  " + map[0][0] + " | " + map[0][1] + " | " + map[0][2]);
		System.out.println("  ---+---+---");
		System.out.println("1  " + map[1][0] + " | " + map[1][1] + " | " + map[1][2]);
		System.out.println("  ---+---+---");
		System.out.println("2  " + map[2][0] + " | " + map[2][1] + " | " + map[2][2]);
	}
	
	public ArrayList<String> availableMoves(){
		ArrayList<String> available = new ArrayList<>();
		for (int i = 0; i<map.length; i++) {
			String letter = Character.toString(i + 97);
			for (int j = 0; j<map[0].length; j++) {
				if (map[j][i] == ' ') {
					available.add(letter+String.valueOf(j));
				}
			}
		}
		return available;
	}
	
	
	public Board move(Board cur, String s, char c) {
		int x = -1;
		char letter = s.charAt(0);
		char number = s.charAt(1);
		x = letter - 97;
		int y = Integer.parseInt(String.valueOf(number));
		ArrayList<String> available = cur.availableMoves();
		cur.map[y][x] = c;
		System.out.println(c+ "@" + s);
		System.out.println();
		return cur;
		
	}
	
	//check win without player
	public char checkWin(Board gameboard) {
		boolean xwin = false;
		boolean owin = false;
		boolean tie = false;
		int xcheck = 0;
		int ocheck = 0;
		int xset;
		int iset;
		for (int i = 0; i<gameboard.map.length; i++) {
			for (int x = 0; x<gameboard.map.length; x++) {
				xset = x;
				iset = i;
				//go left
				while (x>=0) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					x--;
				}
				
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				
				//go right
				while (x<=2) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					x++;
				}
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				
				//up
				while (i>=0) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					i--;
				}
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				
				//down
				while (i <=2) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					i++;
				}
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				
				//left and up
				while (x>=0 && i>=0) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					x--;
					i--;
				}
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				//right and up
				while (x<=2 && i>=0) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					x++;
					i--;
				}
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				//down and left
				while (x>=0 && i<=2) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					i++;
					x--;
				}
				if (xcheck ==3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
				
				//down and right
				while (x<=2 && i<=2) {
					if (gameboard.map[i][x] == 'X') {
						xcheck++;
					}
					if (gameboard.map[i][x] == 'O') {
						ocheck++;
					}
					i++;
					x++;
				}
				if (xcheck == 3) {
					xwin = true;
				}
				if (ocheck == 3) {
					owin = true;
				}
				xcheck = 0;
				ocheck = 0;
				x = xset;
				i = iset;
			}
		}
		if (gameboard.availableMoves().isEmpty()) {
			tie = true;
			return 't';
		}
		else if (xwin) {
			return 'x';
		}
		else if (owin) {
			return 'o';
		}
		return 'n';
	}
	

}
