 
 
 

declare module App {
	export interface IAnswerContract extends App.IParagraphContract {
		questionId: string;
		isRight: boolean;
	}
	export interface IParagraphContract {
		id: string;
		text: string;
		imageUrl: string;
	}
	export interface ICategoryContract extends App.IParagraphContract {
		questions: App.IQuestionContract[];
	}
	export interface IQuestionContract extends App.IParagraphContract {
		categoryId: string;
		subCategoryId: string;
		correct: number;
		answers: App.IAnswerContract[];
	}
}
