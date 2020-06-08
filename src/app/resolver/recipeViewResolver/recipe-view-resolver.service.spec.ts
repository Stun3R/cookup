import { TestBed } from '@angular/core/testing';

import { RecipeViewResolverService } from './recipe-view-resolver.service';

describe('RecipeViewResolverService', () => {
  let service: RecipeViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
