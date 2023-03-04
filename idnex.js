import {Observable, ReplaySubject, Subject, share, shareReplay} from 'rxjs';

console.log('Hot Observable------------------------------------\n\n');

// Hot observable
// values are produced outside of observable
// shares produce values with multiple subscribers
const hotObservable = new Subject();

hotObservable.subscribe((v) => console.log('observer 1: ', v));
hotObservable.subscribe((v) => console.log('observer 2: ', v));

hotObservable.next(1);

/*
* observer 1:  1
* observer 2:  1
*/

console.log('\n');

hotObservable.subscribe((v) => console.log('observer 3: ', v));
hotObservable.subscribe((v) => console.log('observer 4: ', v));

hotObservable.next(2);

/*
* observer 1:  2
* observer 2:  2
* observer 3:  2
* observer 4:  2
* */

console.log('\n\n');

const hotObservableWithPrevValues = new ReplaySubject();

hotObservableWithPrevValues.subscribe((v) => console.log('observer 5: ', v));
hotObservableWithPrevValues.subscribe((v) => console.log('observer 6: ', v));

hotObservableWithPrevValues.next(3);

/*
* observer 5:  3
* observer 6:  3
*/

console.log('\n');

hotObservableWithPrevValues.subscribe((v) => console.log('observer 7: ', v));
hotObservableWithPrevValues.subscribe((v) => console.log('observer 8: ', v));

hotObservableWithPrevValues.next(4);

/*
* observer 7:  3
* observer 8:  3
*
* observer 5:  4
* observer 6:  4
* observer 7:  4
* observer 8:  4
* */

console.log('\n\n\nCold Observable------------------------------------\n\n');

// Cold observable
// Values produce inside of observable
// re-executes logic for each subscriber
const coldObservable = new Observable((observer) => {
    console.log('Pending...')
    setTimeout(() => {
        console.log('Resolved')
        observer.next('Done');
    }, 5000);
});

coldObservable.subscribe((v) => console.log('cold observer 1', v));
coldObservable.subscribe((v) => console.log('cold observer 2', v));

/*
* Pending...
* Pending...
* Resolved
* cold observer 1 Done
* Resolved
* cold observer 2 Done
* */

console.log('\n\n');

const hotObservableFromCold = coldObservable.pipe(share());

hotObservableFromCold.subscribe((v) => console.log('hot from cold 1', v));
hotObservableFromCold.subscribe((v) => console.log('hot from cold 2', v));

/*
* Pending...
* Resolved
* hot from cold 1 Done
* hot from cold 2 Done
* */


setTimeout(() => {
    hotObservableFromCold.subscribe((v) => console.log('hot from cold 3', v));
    hotObservableFromCold.subscribe((v) => console.log('hot from cold 4', v));
}, 10000);

/*
* No emitted value
* */


console.log('\n\n');

const hotObservableFromColdWithPrevValues = coldObservable.pipe(shareReplay());

hotObservableFromColdWithPrevValues.subscribe((v) => console.log('hot from cold with prev values 1', v));
hotObservableFromColdWithPrevValues.subscribe((v) => console.log('hot from cold with prev values 2', v));

/*
* Pending...
* Resolved
* hot from cold with prev values 1 Done
* hot from cold with prev values 2 Done
* */


setTimeout(() => {
    hotObservableFromColdWithPrevValues.subscribe((v) => console.log('hot from cold with prev values 3', v));
    hotObservableFromColdWithPrevValues.subscribe((v) => console.log('hot from cold with prev values 4', v));
}, 10000);

/*
* hot from cold with prev values 3 Done
* hot from cold with prev values 4 Done
* */