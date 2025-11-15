import datetime

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Question

# TODO: if this is how we'll be testing our Django apps in practice, we'll need to account for that in the lint/test action.


# Helper for view testing
def create_question(question_text: str, days_past: int) -> Question:
    time = timezone.now() - datetime.timedelta(days=days_past)
    return Question.objects.create(question_text=question_text, pub_date=time)


class QuestionModelTests(TestCase):
    def test_was_published_recently_with_future_question(self) -> None:
        # Future questions are to be considered "not published recently," as they purport to not yet be published at all
        time = timezone.now() + datetime.timedelta(days=30)
        future_question = Question(pub_date=time)
        self.assertIs(future_question.was_published_recently(), False)

    def test_was_published_recently_with_new_question(self) -> None:
        # Questions one day old or less should be considered recent.
        time = timezone.now() - datetime.timedelta(hours=23, minutes=59, seconds=59)
        recent_question = Question(pub_date=time)
        self.assertIs(recent_question.was_published_recently(), True)

    def test_was_published_recently_with_old_question(self) -> None:
        # Questions older than one day old should be considerd not recent.
        time = timezone.now() - datetime.timedelta(days=1, seconds=1)
        old_question = Question(pub_date=time)
        self.assertIs(old_question.was_published_recently(), False)


class QuestionIndexViewTests(TestCase):
    def test_no_questions(self) -> None:
        # If no currently-published questions exist, an appropriate message should be displayed.
        response = self.client.get(reverse("polls:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(
            response, "No polls are available."
        )  # Coupling the test to the template is a Choice
        self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_past_question(self) -> None:
        # If a currently-published question exists, it should displayed in the index.
        question = create_question("blah", 1)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(response.context["latest_question_list"], [question])

    def test_future_question(self) -> None:
        # Future questions should not be displayed.
        create_question("blah", -1)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_both_past_and_future_questions(self) -> None:
        # Both cases simultaneously.
        create_question("blah future", -1)
        question = create_question("blah past", 1)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(response.context["latest_question_list"], [question])

    def test_two_past_questions(self) -> None:
        # Multiple questions should be able to be displayed, and should be in order.
        question1 = create_question("blah older", 2)
        question2 = create_question("blah newer", 1)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"], [question2, question1]
        )


class QuestionDetailViewTests(TestCase):
    def test_future_question(self) -> None:
        # Future questions should be inaccessible.
        question = create_question("future", -1)
        response = self.client.get(reverse("polls:detail", args=(question.id,)))
        self.assertEqual(response.status_code, 404)

    def test_past_question(self) -> None:
        question = create_question("past", 1)
        response = self.client.get(reverse("polls:detail", args=(question.id,)))
        self.assertContains(response, question.question_text)
