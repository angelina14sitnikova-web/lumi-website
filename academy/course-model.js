import { courses } from './data/courses.js';
import { writingAnswer, writingReady } from './writing/model.js';
import { memoryAnswer, memoryReady } from './memory/model.js';
import { comparisonAnswer, comparisonReady } from './activities/comparison-model.js';

import { colorsAnswer, colorsReady } from './activities/colors-model.js';

import { sensoryAnswer, sensoryReady } from './activities/sensory-model.js';

const graduationKey67 = 'lumi.academy.math67.graduated.v1';
const memoryGraduationKey = 'lumi.academy.memory34.graduated.v1';
const storageKey = 'lumi.academy.completed.v1';
const keyFor = (course, module, lesson) => JSON.stringify([course.id, module.id, lesson.id]);

export function findCourse(id = 'math-3-4') {
  return courses.find(course => course.id === id);
}

export function courseCounts(course) {
  return {
    modules: course.modules.length,
    lessons: course.modules.reduce((sum, module) => sum + module.lessons.length, 0),
  };
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

const practiceTypes = new Map([
  ['writing34', { isReady: writingReady, check: writingAnswer }],
  ['memory34', { isReady: memoryReady, check: memoryAnswer }],
  ['sensory', { isReady: sensoryReady, check: sensoryAnswer }],
  ['colors', { isReady: colorsReady, check: colorsAnswer }],
  ['comparison', { isReady: comparisonReady, check: comparisonAnswer }],
  ['choice', {
    isReady: task => Array.isArray(task.choices) && task.choices.some(choice => choice.id === task.correct),
    check: (task, answer) => task.correct === answer,
  }],
]);

export function checkAnswer(task, answer) {
  const type = practiceTypes.get(task.kind);
  return Boolean(type?.isReady(task) && type.check(task, answer));
}

export function practiceSetIsReady(tasks) {
  return Array.isArray(tasks) && tasks.length > 0 &&
    tasks.every(task => practiceTypes.get(task.kind)?.isReady(task));
}

export function practiceIsReady(lesson) {
  return canOpen(lesson) && practiceSetIsReady(lesson.practice);
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

export function moduleStars(course, module) {
  const completed = readProgress();
  return module.lessons.filter(lesson => practiceIsReady(lesson) &&
    completed.has(keyFor(course, module, lesson))).length;
}

export function passPractice(lesson, answers) {
  return practiceIsReady(lesson) && answers.length === lesson.practice.length &&
    lesson.practice.every((task, index) => checkAnswer(task, answers[index]));
}

export function completionDate67() {
  return readCompletionDate(graduationKey67);
}

export function memoryCompletionDate() {
  return readCompletionDate(memoryGraduationKey);
}

function readCompletionDate(key) {
  try {
    const value = globalThis.localStorage.getItem(key);
    return value && Number.isFinite(Date.parse(value)) ? value : null;
  } catch {
    return null;
  }
}

export function saveCompletion(course, module, lesson, answers) {
  if (!passPractice(lesson, answers)) return false;
  const saved = readProgress();
  const firstCompletion = !saved.has(keyFor(course, module, lesson));
  saved.add(keyFor(course, module, lesson));
  try {
    globalThis.localStorage.setItem(storageKey, JSON.stringify([...saved]));
  } catch {
    return false;
  }
  if (course.id === 'math-6-7' && firstCompletion && course.modules.every(entry =>
    entry.lessons.every(lesson => practiceIsReady(lesson) && saved.has(keyFor(course, entry, lesson))))) {
    try {
      if (!completionDate67()) globalThis.localStorage.setItem(graduationKey67, new Date().toISOString());
    } catch {
      // The lesson remains complete if the optional date cannot be stored.
    }
  }
  if (course.id === 'memory-3-4' && firstCompletion && course.modules.every(entry =>
    entry.lessons.every(lesson => practiceIsReady(lesson) && saved.has(keyFor(course, entry, lesson))))) {
    try {
      if (!memoryCompletionDate()) globalThis.localStorage.setItem(memoryGraduationKey,new Date().toISOString());
    } catch {
      // The completed lessons remain saved if the optional date cannot be stored.
    }
  }
  return true;
}
