 
 
 

declare module App {
	export interface IAnswerContract extends App.IParagraphContract {
		questionId: number;
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
		categoryId: string;
		correct: number;
		answers: App.IAnswerContract[];
	}
}
