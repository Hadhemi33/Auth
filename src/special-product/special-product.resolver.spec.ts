import { Test, TestingModule } from '@nestjs/testing';
import { SpecialProductResolver } from './special-product.resolver';
import { SpecialProductService } from './special-product.service';

describe('SpecialProductResolver', () => {
  let resolver: SpecialProductResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialProductResolver, SpecialProductService],
    }).compile();

    resolver = module.get<SpecialProductResolver>(SpecialProductResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
