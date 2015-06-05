using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using LinqToExcel;

namespace Examinator.Parser
{
    public class ScourceParser
    {
        public string ImagesPath { get; set; }
        public string OutputPath { get; set; }

        public IEnumerable<Category> Parse(string inputXlsx)
        {
            var excel = new ExcelQueryFactory(inputXlsx);
            var proxies = (from c in excel.Worksheet<SourceProxy>("Cars") select c).ToList();
            
            var question = new Question();
            var rightAnswers = 0;
            var newQuestion = false;
            var questions = new List<Question>();
            foreach (var proxy in proxies)
            {
                var id = proxy.Id?.Trim() ?? string.Empty;
                var text = proxy.Text?.Trim() ?? string.Empty;
                if (!string.IsNullOrEmpty(id))
                {
                    var matches = 0;
                    // Question Id
                    if (Regex.IsMatch(id, "\\d{4,}", RegexOptions.IgnoreCase))
                    {
                        if (!question.IsNew)
                        {
                            question = PushQuestion(questions, question, rightAnswers);
                            rightAnswers = 0;
                        }
                        question.Id = Regex.Match(id, "(\\d{4,})", RegexOptions.IgnoreCase).Groups[1].Value;
                        CheckQuestionImage(question);
                        matches++;
                    }
                    // SubCategory Id
                    if (Regex.IsMatch(id, "CARS\\s*\\d+\\.\\d+", RegexOptions.IgnoreCase))
                    {
                        matches++;
                        question.SubCategoryId = Regex.Match(id, "(CARS\\s*\\d{1,}\\.\\d{1,})", RegexOptions.IgnoreCase).Groups[1].Value; 
                    }
                    // Correct answers counter
                    if (Regex.IsMatch(id, "MARK\\s\\d+\\sANSWER", RegexOptions.IgnoreCase))
                    {
                        matches++;
                        rightAnswers = int.Parse(Regex.Match(id, "MARK\\s(\\d+)\\sANSWER", RegexOptions.IgnoreCase).Groups[1].Value);
                    }
                    // Accumulate category name
                    if (matches == 0 || matches == 3)
                    {
                        if (matches == 0)
                        {
                            question.CategoryId = $"{question.CategoryId} {id}";
                        }
                        else
                        {
                            question.CategoryId = Regex.Match(id, "\\n(.+)\\nMARK", RegexOptions.IgnoreCase).Groups[1].Value;
                        }
                    }
                }
                if (!string.IsNullOrEmpty(text))
                {
                    question.Text = $"{question.Text} {text}";
                }
                var answer = GetAnswer(proxy, question);
                if (answer != null)
                {
                    question.Answers.Add(answer);
                }
            }
            var categories = new List<Category>();
            var category = new Category();
            foreach (var q in questions)
            {
                if (q.CategoryId != category.Text)
                {
                    category = PushCategory(categories, category);
                }
                category.Text = q.CategoryId;
                q.CategoryId = category.Id;
                category.Questions.Add(q);
            }
            return categories;
        }

        private void CheckQuestionImage(Question question)
        {
            var filename = $"{question.Id}.png";
            var path = Path.Combine(ImagesPath, filename);
            if (File.Exists(path))
            {
                question.ImageUrl = path;
            }
        }

        private static Category PushCategory(ICollection<Category> categories, Category category)
        {
            // skip the first empty one
            if (category.Questions.Count > 0)
            {
                categories.Add(category);
                Console.WriteLine(" [+] Category [{0}] added with [{1}] questions", category.Text, category.Questions.Count);
            }
            return new Category();
        }

        private static Question PushQuestion(List<Question> questions, Question question, int rightAnswers)
        {
            questions.Add(question);
            if (question.CorrectAnswersNumber != rightAnswers)
            {
                Console.WriteLine(" [-] Question [{0}] is expected to have [{1}] correct answers but parsed [{2}]",
                    question.Id, rightAnswers, question.CorrectAnswersNumber);
            }
            else
            {
                Console.WriteLine(" [+] Added Question [{0}]({1}) added with [{2}/{3}] answers", question.Id, question.Text, question.Answers.Count, question.CorrectAnswersNumber);
            }
            return new Question();
        }
        private Answer GetAnswer(SourceProxy proxy, Question question)
        {
            var answer = new Answer
            {
                Id = Guid.NewGuid().ToString(),
                IsRight = !string.IsNullOrEmpty(proxy.AnswerIsRight) && proxy.AnswerIsRight.Trim().Length > 0,
                Text = proxy.AnswerText,
                QuestionId = question.Id
            };
            var filename = $"{question.Id}.{question.Answers.Count + 1}.png";
            var path = Path.Combine(ImagesPath, filename);
            if (File.Exists(path))
            {
                answer.ImageUrl = path;
            }

            if (string.IsNullOrEmpty(proxy.AnswerText) && string.IsNullOrEmpty(answer.ImageUrl))
            {
                return null;
            }
            return answer;
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

    public class SourceProxy
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string AnswerIsRight { get; set; }
        public string AnswerText { get; set; }
    }
}
