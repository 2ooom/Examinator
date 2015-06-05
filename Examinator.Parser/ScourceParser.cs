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
                            question.CategoryId = Regex.Match(id, "\\n(.+)[\\n|\\s]MARK", RegexOptions.IgnoreCase).Groups[1].Value;
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
            questions.Add(question);
            var categories = new List<Category>();
            var category = new Category();
            foreach (var q in questions)
            {
                var text = q.CategoryId.Trim().Replace("\n", " ");
                if (text != category.Text)
                {
                    category = PushCategory(categories, category);
                }
                category.Text = text;
                q.CategoryId = category.Id;
                category.Questions.Add(q);
            }
            PushCategory(categories, category);
            Console.WriteLine();
            
            foreach (var c in categories)
            {
                Console.WriteLine("Category [{0}] with [{1}] questions", c.Text, c.Questions.Count);
            }
            Test(categories);
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

        private static void Test(List<Category> categories)
        {
            try
            {
                var testData = GetQuestionsByCategoryCheck();
                var total = testData.Sum(t => t.Value);
                var actualTotal = categories.Sum(t => t.Questions.Count);
                if (total != actualTotal)
                {
                    Console.WriteLine("Total questions number expected [{0}] but was [{1}]", total, actualTotal);
                }
                foreach (var category in categories)
                {
                    var count = testData[category.Text];
                    if (category.Questions.Count != count)
                    {
                        Console.WriteLine("Total questions expected in [{0}] is [{1}] but was [{2}]", category.Text, count, category.Questions.Count);
                    } 
                }
                Console.WriteLine("Test Passed");
            }
            catch (Exception)
            {
                Console.WriteLine("Test failed unexpectedly");
                throw;
            }
        }

        private static Dictionary<string, int> GetQuestionsByCategoryCheck()
        {
            return new Dictionary<string, int>
            {
                {"ALERTNESS", 24 },
                {"ATTITUDE", 30 },
                {"SAFETY AND YOUR VEHICLE", 45 },
                {"SAFETY MARGINS", 29 },
                {"HAZARD AWARENESS", 29 },
                {"VULNERABLE ROAD USERS", 61 },
                {"OTHER TYPE OF VEHICLES", 19 },
                {"VEHICLE HANDLING", 37 },
                {"DUAL CARRIAGEWAY RULES", 11 },
                {"RULES OF THE ROAD", 45 },
                {"ROAD AND TRAFFIC SIGNS", 71 },
                {"DOCUMENTS", 11 },
                {"ACCIDENTS", 27 },
                {"VEHICLE LOADING", 5 },
            };
        }

        private static Category PushCategory(ICollection<Category> categories, Category category)
        {
            // skip the first empty one
            if (category.Questions.Count > 0)
            {
                var existing = categories.FirstOrDefault(t => t.Text == category.Text);
                if (existing != null)
                {
                    foreach (var question in category.Questions)
                    {
                        question.CategoryId = existing.Id;
                    }
                    existing.Questions = existing.Questions.Union(category.Questions).ToList();
                    Console.WriteLine(" [*] Category [{0}] updated with [{1}] questions. Last Question [{2}]",
                        category.Text, category.Questions.Count, category.Questions.Last().Id);
                }
                else
                {
                    categories.Add(category);
                    Console.WriteLine(" [+] Category [{0}] added with [{1}] questions. Last Question [{2}]",
                        category.Text, category.Questions.Count, category.Questions.Last().Id);
                }
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
                //Console.WriteLine(" [+] Added Question [{0}]({1}) added with [{2}/{3}] answers", question.Id, question.Text, question.Answers.Count, question.CorrectAnswersNumber);
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
    }

    public class SourceProxy
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string AnswerIsRight { get; set; }
        public string AnswerText { get; set; }
    }
}
