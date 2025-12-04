from django.test import TestCase
from django.urls import reverse
from .models import Task

class TodoAppTests(TestCase):

    def test_home_page_status_code(self):
        """
        Tests that the home page returns a 200 OK status code.
        """
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)

    def test_home_page_uses_correct_template(self):
        """
        Tests that the home page uses the home.html template.
        """
        response = self.client.get(reverse('home'))
        self.assertTemplateUsed(response, 'home.html')

    def test_home_page_contains_correct_text(self):
        """
        Tests that the home page contains the text "My TODO List".
        """
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'My TODO List')

    def test_task_creation(self):
        """
        Tests that a new task can be created.
        """
        response = self.client.post(reverse('home'), {
            'title': 'A new task',
            'description': 'A new description'
        })
        self.assertEqual(response.status_code, 302)  # Check for redirect
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().title, 'A new task')

    def test_task_display(self):
        """
        Tests that tasks are displayed on the home page.
        """
        Task.objects.create(title='Test Task', description='Test Description')
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'Test Task')
        self.assertContains(response, 'Test Description')

    def test_task_model_str(self):
        """
        Tests the string representation of the Task model.
        """
        task = Task.objects.create(title='A test task')
        self.assertEqual(str(task), 'A test task')
