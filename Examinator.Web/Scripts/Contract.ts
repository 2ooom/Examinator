 
 
 

declare module App {
	export interface IAnswer extends App.IParagraph {
		QuestionId: string;
		IsRight: boolean;
	}
	export interface IParagraph {
		Id: string;
		Text: string;
		ImageUrl: string;
	}
	export interface ICategory extends App.IParagraph {
		Questions: App.IQuestion[];
	}
	export interface IQuestion extends App.IParagraph {
		CategoryId: string;
		SubCategoryId: string;
		CorrectAnswersNumber: number;
		Answers: App.IAnswer[];
	}
}
