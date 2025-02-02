import { Test, TestingModule } from '@nestjs/testing';
import { BidsService } from './bids.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Bid } from '../entities/bid.entity';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';
import { BidsGateway } from './bids.gateway';

describe('BidsService', () => {
  let service: BidsService;
  let bidRepository: Repository<Bid>;
  let itemRepository: Repository<Item>;
  let userRepository: Repository<User>;

  const mockBidRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockItemRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockConnection = {
    transaction: jest.fn().mockImplementation((cb) => cb({
      getRepository: (entity) => {
        if (entity === Bid) return mockBidRepository;
        if (entity === Item) return mockItemRepository;
        if (entity === User) return mockUserRepository;
      },
    })),
  };

  const mockBidsGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        {
          provide: BidsGateway,
          useValue: mockBidsGateway,
        },
        {
          provide: getRepositoryToken(Bid),
          useValue: mockBidRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
    bidRepository = module.get<Repository<Bid>>(getRepositoryToken(Bid));
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('placeBid', () => {
    it('should return an error if the item is not found', async () => {
      mockItemRepository.findOne.mockResolvedValue(null);

      const result = await service.placeBid({
        item_id: 1,
        user_id: 1,
        amount: 600,
      });

      expect(result).toEqual({ success: false, message: 'Item not found' });
    });

    
   
    it('should handle other errors', async () => {
      const mockItem = {
        id: 1,
        name: 'Test Item',
        starting_price: 500,
        auction_duration: new Date(Date.now() + 10000), // Auction active
        bids: [{ amount: 600 }],
        version: 1,
      };
      const mockUser = { id: 1, name: 'Test User' };

      mockItemRepository.findOne.mockResolvedValue(mockItem);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBidRepository.create.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(
        service.placeBid({
          item_id: 1,
          user_id: 1,
          amount: 700,
        }),
      ).rejects.toThrow('Failed to place bid');
    });
  });
});