package tic_tac_toe;

import java.util.*;

public class Opponent {

	static int x;
	static int y;
	static int type;
	static char[][] array = new char[3][3];
	static boolean play = true;
	
	public Opponent(int type){
		this.type = type;
	}
	
	public void move(Board board, String opponent) throws CloneNotSupportedException{
		Random rand = new Random();
		ArrayList<String> available = board.availableMoves();
		switch(type) {
		case (1): //random selection
			int index = rand.nextInt(available.size());
			String move = available.get(index);
			x = move.charAt(0) - 97;
			y = Integer.parseInt(String.valueOf(move.charAt(1)));
			board.map[y][x] = opponent.charAt(0);
			break;
		case (2): //MINI-MAX
			board.move(board, minimax(board, opponent.charAt(0)), opponent.charAt(0));
		}
		
	}
	
	
	public String minimax(Board board, char opp) throws CloneNotSupportedException {
		char other = 'T';
		if (opp == 'X') {
			other = 'O';
		}
		else if (opp == 'O') {
			other = 'X';
		}
		double max_value = Double.NEGATIVE_INFINITY;
		double min_value = Double.POSITIVE_INFINITY;
		String move = null;
		
		for (String s : board.availableMoves()) {
			Board new_board = new Board(board.map);
			Board moved_board = new_board.move(new_board, s, opp);
			double value = minimax_decision(moved_board, other);
				if (value > max_value) {
					max_value = value;
					move = s;
				}
		}
		return move;
	}
	
	public double minimax_decision(Board board, char other) throws CloneNotSupportedException{
		
			return min_value(board, other);
	}
	
	public double max_value(Board board, char opp) throws CloneNotSupportedException {
		if (board.checkWin(board) != 'n') {
			char other = 'P';
			if (opp == 'X') {
				other = 'O';
			}
			else {
				other = 'X';
			}
			double value = Double.NEGATIVE_INFINITY;
			if (board.checkWin(board) == opp) {
				value = 1.00;
			}
			else if (board.checkWin(board) == other) {
				value = -1.00;
			}
			else if (board.checkWin(board) == 't') {
				value = 0.00;
			}
			return value;
		}
		double v = Double.NEGATIVE_INFINITY;
		
		char other = 'P';
		if (opp == 'X') {
			other = 'O';
		}
		else {
			other = 'X';
		}
		
		for (String s: board.availableMoves()) {
			Board new_board = new Board(board);
			Board moved_board = new_board.move(new_board, s, opp);
			v = Math.max(v, min_value(moved_board, other));
		}
		return v;
	}
	
	public double min_value(Board board, char other) throws CloneNotSupportedException {
		if (board.checkWin(board) != 'n') {
			double value = Double.POSITIVE_INFINITY;
			char opp = 'P';
			if (other == 'X') {
				opp = 'O';
			}
			else {
				opp = 'X';
			}
			if (board.checkWin(board) == opp) {
				value = 1.00;
			}
			else if (board.checkWin(board) == 't') {
				value = 0.00;
			}
			else if (board.checkWin(board) == other) {
				value = -1.00;
			}
			return value;
		}
		double v = Double.POSITIVE_INFINITY;
		
		char opp = 'P';
		if (other == 'X') {
			opp = 'O';
		}
		else {
			opp = 'X';
		}
		
		for (String s: board.availableMoves()) {
			Board new_board = new Board(board);
			Board moved_board = new_board.move(new_board, s, other);
			v = Math.min(v, max_value(moved_board, opp));
		}
		return v;
	}
	
	public double minimax_decision_2(Board board, char other) throws CloneNotSupportedException{

		return min_value(board, other);
	}

	public double max_value_2(Board board, char opp) throws CloneNotSupportedException {
		if (board.checkWin(board) != 'n') {
			char other = 'P';
			if (opp == 'X') {
				other = 'O';
			}
			else {
				other = 'X';
			}
			double value = Double.NEGATIVE_INFINITY;
			if (board.checkWin(board) == opp) {
				value = 1.00;
			}
			else if (board.checkWin(board) == other) {
				value = -1.00;
			}
			else if (board.checkWin(board) == 't') {
				value = 0.00;
			}
			return value;
		}
		double v = Double.NEGATIVE_INFINITY;

		char other = 'P';
		if (opp == 'X') {
			other = 'O';
		}
		else {
			other = 'X';
		}

		for (String s: board.availableMoves()) {
			Board new_board = new Board(board);
			Board moved_board = new_board.move(new_board, s, opp);
			v = Math.max(v, min_value(moved_board, other));
			if (v>board.alpha) {
				board.alpha = v;
			}
		}
		board.beta = board.alpha;
		return v;
	}

	public double min_value_2(Board board, char other) throws CloneNotSupportedException {
		if (board.checkWin(board) != 'n') {
			double value = Double.POSITIVE_INFINITY;
			char opp = 'P';
			if (other == 'X') {
				opp = 'O';
			}
			else {
				opp = 'X';
			}
			if (board.checkWin(board) == opp) {
				value = 1.00;
			}
			else if (board.checkWin(board) == 't') {
				value = 0.00;
			}
			else if (board.checkWin(board) == other) {
				value = -1.00;
			}
			return value;
		}
		double v = Double.POSITIVE_INFINITY;

		char opp = 'P';
		if (other == 'X') {
			opp = 'O';
		}
		else {
			opp = 'X';
		}

		for (String s: board.availableMoves()) {
			Board new_board = new Board(board);
			Board moved_board = new_board.move(new_board, s, other);
			v = Math.min(v, max_value(moved_board, opp));
			if(v<board.beta) {
				board.beta = v;
			}
		}
		board.alpha = board.beta;
		return v;
	}


}
