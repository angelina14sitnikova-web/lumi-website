import { library as speechLibrary } from './speech34/library.js';
import { stories as speechStories } from './speech34/stories.js';
import { theatre as speechTheatre } from './speech34/theatre.js';
import { talk as speechTalk } from './speech34/talk.js';
import { train as speechTrain } from './speech34/train.js';
import { village as speechVillage } from './speech34/village.js';
import { actions as speechActions } from './speech34/actions.js';
import { parts as speechParts } from './speech34/parts.js';
import { traits as speechTraits } from './speech34/traits.js';
import { town as speechTown } from './speech34/town.js';
import { academy as logicAcademy } from './logic34/academy.js';
import { railway as logicRailway } from './logic34/railway.js';
import { castle as logicCastle } from './logic34/castle.js';
import { detectives as logicDetectives } from './logic34/detectives.js';
import { garden as logicGarden } from './logic34/garden.js';
import { factory as logicFactory } from './logic34/factory.js';
import { museum } from './logic34/museum.js';
import { comparisonLessons } from './comparison-3-4.js';

import { colorLessons } from './colors-3-4.js';

import { colorWorldLessons } from './color-world-3-4.js';
import { sizeLessons } from './sizes-3-4.js';

import { dimensionsLessons } from './dimensions-3-4.js';
import { shapesLessons } from './shapes-3-4.js';

import { shapeWorldLessons } from './shape-world-3-4.js';
import { quantityLessons } from './quantity-3-4.js';

import { finalLessons } from './final-3-4.js';

import { properties } from './math45/properties.js';

import { countFive } from './math45/counting.js';
import { quantityNumber } from './math45/quantity.js';
import { ordinal } from './math45/ordinal.js';
import { geometry, mosaic } from './math45/geometry.js';
import { magnitude } from './math45/magnitude.js';
import { routes } from './math45/routes.js';
import { calendar } from './math45/calendar.js';
import { journey } from './math45/journey.js';

import { countTen } from './math56/counting.js';

import { digitLow, digitHigh } from './math56/digits.js';

import { orderTen } from './math56/order.js';
import { comparing, unitHouses } from './math56/groups.js';

import { geometry56 } from './math56/geometry.js';

import { measurement } from './math56/measure.js';

import { spatial56 } from './math56/spatial.js';

import { time56 } from './math56/time.js';

// Add completed scene and practice definitions by their permanent lesson IDs.
import { numberPortals } from './math67/numbers.js';
import { numberHouses } from './math67/parts.js';
import { addition, subtraction } from './math67/arithmetic.js';
import { detectives } from './math67/stories.js';
import { engineering } from './math67/engineering.js';
import { geometry67 } from './math67/geometry.js';
import { spatial67 } from './math67/spatial.js';
import { time67 } from './math67/time.js';
import { workshop67 } from './math67/workshop.js';
import { observers } from './memory34/observers.js';
import { castle } from './memory34/castle.js';
import { valley } from './memory34/valley.js';
import { railway } from './memory34/railway.js';
import { town } from './memory34/town.js';
import { island } from './memory34/island.js';

import { makers } from './writing34/makers.js';
import { garden } from './writing34/garden.js';
import { pencils } from './writing34/pencils.js';
import { clouds } from './writing34/clouds.js';
import { patterns } from './writing34/patterns.js';
import { artists } from './writing34/artists.js';

import { forest } from './literacy34/forest.js';
import { city } from './literacy34/city.js';

import { echo as literacyEcho } from './literacy34/echo.js';

import { rhythm as literacyRhythm } from './literacy34/rhythm.js';

import { island as literacyIsland } from './literacy34/island.js';

const listeningLessons = Object.fromEntries(Object.entries({forest,city,echo:literacyEcho,rhythm:literacyRhythm,island:literacyIsland}).flatMap(([world,program]) =>
  Object.entries(program.lessons).map(([id, lesson]) => [
    id, { ...lesson, format: 'literacy34', world,
      practice: lesson.practice.map(task => ({ ...task, activity: task.kind, kind: 'literacy34' })) },
  ])));

export const lessonContent = { ...speechLibrary, ...speechStories, ...speechTheatre, ...speechTalk, ...speechTrain, ...speechVillage, ...speechActions, ...speechParts, ...speechTraits, ...speechTown, ...logicAcademy, ...logicRailway, ...logicCastle, ...logicDetectives, ...logicGarden, ...logicFactory, ...museum, ...listeningLessons, ...makers, ...garden, ...pencils, ...clouds, ...patterns, ...artists, ...observers, ...castle, ...valley, ...railway, ...town, ...island, ...comparisonLessons, ...colorLessons, ...colorWorldLessons, ...sizeLessons, ...dimensionsLessons, ...shapesLessons, ...shapeWorldLessons, ...quantityLessons, ...finalLessons, ...properties, ...countFive, ...quantityNumber, ...ordinal, ...geometry, ...mosaic, ...magnitude, ...routes, ...calendar, ...journey, ...countTen, ...digitLow, ...digitHigh, ...orderTen, ...comparing, ...unitHouses, ...geometry56, ...measurement, ...spatial56, ...time56, ...numberPortals, ...numberHouses, ...addition, ...subtraction, ...detectives, ...engineering, ...geometry67, ...spatial67, ...time67, ...workshop67 };
