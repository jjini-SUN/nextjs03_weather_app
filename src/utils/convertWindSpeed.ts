// meters per seconds ==> kilometers per hours
export function convertWindSpeed(speedInMetersPerSecond: number): string {
  const speedInKilometersPerHour = (speedInMetersPerSecond * 3.6).toFixed(1); // 첫째자리까지 반올림
  return `${speedInKilometersPerHour}km`;
}
