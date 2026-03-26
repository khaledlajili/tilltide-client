import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity } from '@ngrx/signals/entities';
import { inject } from '@angular/core';
import { Employee } from 'src/app/core/models/employee.model';
import { EmployeeRepository } from '../data/employee.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const EmployeeStore = signalStore(
    { providedIn: 'root' },
    withEntities<Employee>(),
    withState({ loading: false }),
    withMethods((store, repo = inject(EmployeeRepository)) => ({

        loadAll: rxMethod<string>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap((workspaceId) => repo.findAll(workspaceId).pipe(
                tap(employees => patchState(store, setAllEntities(employees), { loading: false }))
            ))
        )),

        addEmployee(employee: Employee) {
            patchState(store, addEntity(employee));
        }

    }))
);
