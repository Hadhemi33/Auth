import { Test, TestingModule } from '@nestjs/testing';
import { SpecialProductPriceResolver } from './special-product-price.resolver';
import { SpecialProductPriceService } from './special-product-price.service';

describe('SpecialProductPriceResolver', () => {
  let resolver: SpecialProductPriceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialProductPriceResolver, SpecialProductPriceService],
    }).compile();

    resolver = module.get<SpecialProductPriceResolver>(SpecialProductPriceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
