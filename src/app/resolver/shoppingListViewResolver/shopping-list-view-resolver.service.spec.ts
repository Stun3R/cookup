import { TestBed } from '@angular/core/testing';

import { ShoppingListViewResolverService } from './shopping-list-view-resolver.service';

describe('ShoppingListViewResolverService', () => {
  let service: ShoppingListViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingListViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
