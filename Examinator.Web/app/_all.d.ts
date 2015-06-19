/// <reference path="../Scripts/Contract.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../Scripts/typings/cordova-ionic/cordova-ionic.d.ts" />

/// <reference path="servicies/Utils.ts" />
/// <reference path="servicies/Categories.ts" />
/// <reference path="servicies/Confirm.ts" />
/// <reference path="servicies/Servicies.ts" />
/// <reference path="servicies/Settings.ts" />
/// <reference path="servicies/Storage.ts" />

/// <reference path="controllers/AppCtrl.ts" />
/// <reference path="controllers/SettingsCtrl.ts" />
/// <reference path="controllers/CategoriesCtrl.ts" />
/// <reference path="controllers/CategoryCtrl.ts" />
/// <reference path="controllers/ExamCtrl.ts" />

declare var StatusBar: any;
declare var cordova: ICordova;

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