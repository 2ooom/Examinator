 
 
 

declare module App {
	export interface IAnswerContract extends App.IParagraphContract {
		isRight: boolean;
	}
	export interface IParagraphContract {
		id: number;
		text: string;
		imageUrl: string;
	}
	export interface ICategoryContract extends App.IParagraphContract {
		questions: App.IQuestionContract[];
	}
	export interface IQuestionContract extends App.IParagraphContract {
		categoryId: number;
		correct: number;
		answers: App.IAnswerContract[];
	}
}
