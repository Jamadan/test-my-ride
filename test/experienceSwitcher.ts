import { cookies } from 'storageUtils';

import { Experiences as Jams } from 'package/lib/index';
import { SCOPES_COOKIE } from '../shared/constants';
import TabType from '../shared/enums';
import { PlatesDict } from '../shared/entities/locations';
import { getScopesFromQuery } from '../shared/scopes';

export const CODE = 'JAM';

let dss: string[] = [];
export const setDS = (scopes?: string[]) =>
  (dss = scopes ? scopes.map(scope => scope.toLowerCase()) : []);

const dontContainCode = (locations: PlatesDict, loc?: string) =>
  !!(loc && locations[loc] && locations[loc]!.countryCode) &&
  locations[loc]!.countryCode !== CODE;

const platesMissing = (plates: PlatesDict, plate?: string) =>
  !plate || !plates[plate];

export const getCurrentJam = (
  platea?: string,
  plateb?: string,
  plates?: PlatesDict,
  selectedTab?: TabType
) => {
  if (!plates) {
    return Jams.STRAWBERRY;
  }

  const isBreakfast = [platea, plateb].some(
    loc =>
      dontContainCode(plates, loc) ||
      (!!platea && !!plateb && platesMissing(plates, loc))
  );

  if (isBreakfast) {
    return selectedTab && selectedTab === TabType.TOAST
      ? Jams.DAMSON
      : Jams.RASPBERRY;
  }

  return selectedTab && selectedTab === TabType.TOAST
    ? Jams.PLUM
    : Jams.STRAWBERRY;
};

export const getScopesCookie = (): string[] => {
  const scopes = cookies.getItem(SCOPES_COOKIE);
  return getScopesFromQuery(scopes, undefined, dss);
};

export const isRaspberryOrDamson = (
  origin?: string,
  destination?: string,
  locations?: PlatesDict
) =>
  getCurrentJam(origin, destination, locations) ===
  (Jams.RASPBERRY || Jams.DAMSON);

export const isDamson = (
  origin?: string,
  destination?: string,
  locations?: PlatesDict
) => getCurrentJam(origin, destination, locations) === Jams.DAMSON;

export const isPlumOrStrawberry = (
  origin?: string,
  destination?: string,
  locations?: PlatesDict
) => !isRaspberryOrDamson(origin, destination, locations);
