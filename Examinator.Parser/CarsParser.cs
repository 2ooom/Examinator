using System;
using System.Collections.Generic;
using System.Linq;
using LinqToExcel;

namespace Examinator.Parser
{
    public class CarsParser
    {
        public IEnumerable<Category> Parse(string inputXlsx)
        {
            var questions = new List<Category>();
            var excel = new ExcelQueryFactory(inputXlsx);
            var proxies = (from c in excel.Worksheet<CarsProxy>("Cars") select c).ToList();
            var question = new Question();
            var category = new Category();
            
            foreach (var proxy in proxies)
            {
                var id = proxy.Id.Trim();
                var text = proxy.Text.Trim();
                int idInt;
                if (!string.IsNullOrEmpty(id) && int.TryParse(id, out idInt))
                {
                    if (!question.IsNew)
                    {
                        question = PushQuestion(category, question);
                    }
                    else
                    {
                        question.Id = id;
                    }
                } else if (!string.IsNullOrEmpty(id))
                {
                    var pattern = "MARK [1-9] ANSWER?";

                }
                if (!string.IsNullOrEmpty(text))
                {
                    question.Text = $"{question.Text} {text}";
                }
                var answer = GetAnswer(proxy);
                if (answer != null)
                {
                    question.Answers.Add(answer);
                }
            }
            return questions;
        }

        private static Question PushQuestion(Category category, Question question)
        {
            category.Questions.Add(question);
            question = new Question();
            return question;
        }
        private static Answer GetAnswer(CarsProxy proxy)
        {
            if (string.IsNullOrEmpty(proxy.AnswerText))
            {
                return null;
            }

            return new Answer
            {
                Id = Guid.NewGuid().ToString(),
                IsRight = proxy.AnswerIsRight.Trim().Length > 0,
                Text = proxy.AnswerText
            };
        }

        private static IEnumerable<Category> GetTestData()
        {
            return new List<Category>
            {
                new Category
                {
                    Id = Guid.NewGuid().ToString(),
                    Text = "ALERTNESS",
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            Id = "2562",
                            Text = "Before making a U - turn in the road you should always:",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "Select a higher gear than normal"},
                                new Answer {Text = "Signal so that other drivers can slow down"},
                                new Answer {Text = "Look over your shoulder for final confirmation", IsRight = true},
                                new Answer {Text = "Give another signal as well as using your indicators"},
                            }
                        },
                        new Question
                        {
                            Id = "4212",
                            Text = "As a driver what do you understand by the term 'Blind Spot'?",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "An area covered by your left hand mirror"},
                                new Answer {Text = "An area not covered by your headlights"},
                                new Answer {Text = "An area covered by your right hand mirror"},
                                new Answer {Text = "An area not covered by your mirrors", IsRight = true},
                            }
                        },
                        new Question
                        {
                            Id = "4213",
                            Text = "What does the abbreviation MSM mean?",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "Mirror signal manoeuvre", IsRight = true},
                                new Answer {Text = "Manoeuvre speed mirror"},
                                new Answer {Text = "Mirror speed manoeuvre "},
                                new Answer {Text = "Manoeuvre signal mirror"},
                            }
                        },
                        new Question
                        {
                            Id = "4214",
                            Text = "When following a large vehicle you should stay well back because",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "It helps you to keep out of the wind"},
                                new Answer {Text = "It helps the large vehicle to stop more easily"},
                                new Answer {Text = "It allows the driver to see you in the mirror", IsRight = true},
                                new Answer {Text = "It allows you to corner more quickly"},
                            }
                        },
                        new Question
                        {
                            Id = "4215",
                            Text = "In which of these following situations should you avoid overtaking?",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "On a 50 kph road"},
                                new Answer {Text = "In a one-way street"},
                                new Answer {Text = "Just after a bend"},
                                new Answer {Text = "Approaching a dip in the road", IsRight = true},
                            }
                        },
                        new Question
                        {
                            Id = "4216",
                            Text =
                                "You should not use a mobile phone Because reception is poor when the engine is running whilst driving",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "Because reception is poor when the engine is running"},
                                new Answer {Text = "Unless you are able to drive one handed"},
                                new Answer
                                {
                                    Text = "Because it might distract your attention from the road ahead",
                                    IsRight = true
                                },
                                new Answer {Text = "Until you are satisfied that no other traffic is near"},
                            }
                        },
                        new Question
                        {
                            Id = "4217",
                            Text =
                                "Your vehicle is fitted with a hands-free phone system. Using this equipment whilst driving",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "Could be very good for road safety"},
                                new Answer {Text = "Could distract your attention from the road", IsRight = true},
                                new Answer {Text = "Is recommended by The Highway Code"},
                                new Answer {Text = "Is quite safe as long as you slow down"},
                            }
                        },
                    }
                }

            };
        } 
    }

    public class CarsProxy
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string AnswerIsRight { get; set; }
        public string AnswerText { get; set; }
    }
}
