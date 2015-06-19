/// <reference path="../Scripts/Contract.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../Scripts/typings/cordova-ionic/cordova-ionic.d.ts" />

/// <reference path="servicies/utils.ts" />
/// <reference path="servicies/categories.ts" />
/// <reference path="servicies/confirm.ts" />
/// <reference path="servicies/servicies.ts" />
/// <reference path="servicies/settings.ts" />
/// <reference path="servicies/storage.ts" />

declare var StatusBar: any;
declare var cordova: ICordova;
declare var categories: any;

interface ICordova {
    plugins:any;
}

declare module App {
    export interface IQuestion extends IQuestionContract {
        isCorrect: boolean;
        isAnswered: boolean;
        answers: IAnswer[];
    }
    export interface IAnswer extends IAnswerContract {
        selected: boolean;
    }
    export interface ICategory extends ICategoryContract {
        questions: IQuestion[];
    }
}