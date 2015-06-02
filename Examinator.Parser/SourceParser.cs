using System;
using System.Collections.Generic;
using HtmlAgilityPack;

namespace Examinator.Parser
{
    public class SourceParser
    {
        public IEnumerable<Category> Parse(HtmlDocument document)
        {
            var questions = new List<Category>
            {
                new Category
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "ALERTNESS",
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
                            Text = "You should not use a mobile phone Because reception is poor when the engine is running whilst driving",
                            Answers = new List<Answer>
                            {
                                new Answer {Text = "Because reception is poor when the engine is running"},
                                new Answer {Text = "Unless you are able to drive one handed"},
                                new Answer {Text = "Because it might distract your attention from the road ahead", IsRight = true},
                                new Answer {Text = "Until you are satisfied that no other traffic is near"},
                            }
                        },
                        new Question
                        {
                            Id = "4217",
                            Text = "Your vehicle is fitted with a hands-free phone system. Using this equipment whilst driving",
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
            return questions;
        }
    }
}
