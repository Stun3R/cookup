import { TestBed } from '@angular/core/testing';

import { AlimentViewResolverService } from './aliment-view-resolver.service';

describe('AlimentViewResolverService', () => {
  let service: AlimentViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlimentViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
