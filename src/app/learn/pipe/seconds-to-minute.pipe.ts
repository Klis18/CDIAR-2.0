import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToMinute'
})
export class SecondsToMinutePipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value) || value < 0) return '00:00';

    const minutes: number = Math.floor(value / 60);
    const seconds: number = Math.floor(value % 60);

    const minutesStr: string = this.padNumber(minutes);
    const secondsStr: string = this.padNumber(seconds);

    return `${minutesStr}:${secondsStr}`;
  }

  private padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
