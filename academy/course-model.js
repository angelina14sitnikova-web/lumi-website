import { courses } from './data/courses.js';

const storageKey = 'lumi.academy.completed.v1';
const keyFor = (course, module, lesson) => JSON.stringify([course.id, module.id, lesson.id]);

export function findCourse(id = 'math-3-4') {
  return courses.find(course => course.id === id);
}

export function findLesson(course, moduleId, lessonId) {
  const module = course?.modules.find(entry => entry.id === moduleId);
  const lesson = module?.lessons.find(entry => entry.id === lessonId);
  return { module, lesson };
}

export function programUrl(course, module) {
  const query = new URLSearchParams({ course: course.id });
  return 'program.html?' + query + (module ? '#module-' + encodeURIComponent(module.id) : '');
}

export function lessonUrl(course, module, lesson) {
  return 'lesson.html?' + new URLSearchParams({ course: course.id, module: module.id, lesson: lesson.id });
}

export function canOpen(lesson) {
  return Boolean(lesson?.scenes?.length);
}

export function checkAnswer(task, choiceId) {
  return task.kind === 'choice' && task.choices?.some(choice => choice.id === choiceId) && task.correct === choiceId;
}

export function practiceIsReady(lesson) {
  return canOpen(lesson) && Boolean(lesson.practice?.length) &&
    lesson.practice.every(task => task.kind === 'choice' && checkAnswer(task, task.correct));
}

function readProgress() {
  try {
    const saved = JSON.parse(globalThis.localStorage.getItem(storageKey));
    return Array.isArray(saved) ? new Set(saved.filter(value => typeof value === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function isComplete(course, module, lesson) {
  return practiceIsReady(lesson) && readProgress().has(keyFor(course, module, lesson));
}

export function passPractice(lesson, answers) {
  return practiceIsReady(lesson) && answers.length === lesson.practice.length &&
    lesson.practice.every((task, index) => checkAnswer(task, answers[index]));
}

export function saveCompletion(course, module, lesson, answers) {
  if (!passPractice(lesson, answers)) return false;
  const saved = readProgress();
  saved.add(keyFor(course, module, lesson));
  try {
    globalThis.localStorage.setItem(storageKey, JSON.stringify([...saved]));
    return true;
  } catch {
    return false;
  }
}
