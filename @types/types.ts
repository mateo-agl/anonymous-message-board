import { Types } from "mongoose";

type FetchData = (url: string, action: (data: any) => void) => void;

interface ThreadReqBody {
	thread_id?: string,
	reply_id?: string
}

interface RepliesData {
	_id: string,
	text: string,
	created_on: Date,
	bumped_on: Date
}

interface ThreadState {
	_id?: string,
	text?: string,
	created_on?: Date,
	bumped_on?: Date,
	replies?: Array<RepliesData>,
	formClass?: string,
	reqBody?: ThreadReqBody,
	board?: string
}

interface MainState {
	bFormClass?: string,
	board?: string,
	threadList?: Array<ThreadState>
}

interface BoardState {
	formClass?: string,
	reqBody?: ThreadReqBody,
	threads?: Array<ThreadState>
}

interface BoardObj { 
    name: string
}

interface SearchState {
	name: string,
	matches: Array<BoardObj>
}

interface ReportBtnState {
	text: string,
	class: string
}

interface CreateFormState {
	selectClass: string,
	input: string,
	newThread: {
		board: string,
		delete_password: string,
		text: string
	}
}

type Done = (arg0?: any) => void;

interface Reply {
  _id: Types.ObjectId,
  text: string,
  created_on: Date,
  bumped_on: Date,
  delete_password: string,
  reported: number,
}

interface Thread {
  _id: Types.ObjectId,
  text: string,
  created_on: Date,
  bumped_on: Date,
  reported?: number,
  delete_password?: string,
  replies: Array<Reply>,
  board: string
}

interface Board {
	name: string,
  	threads: Array<Thread> & {
		id: (arg0: Types.ObjectId) => any
	}
}

export type {
	FetchData,
	BoardObj,
	SearchState,
	ThreadState,
	ThreadReqBody,
	RepliesData,
	MainState,
	BoardState,
	ReportBtnState,
	CreateFormState,
	Done,
	Reply,
	Thread,
	Board
};