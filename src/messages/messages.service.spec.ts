import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageStatus } from './dto/update-message.dto';
import { MessagesService } from './messages.service';
import { ValidationStrategy } from './strategies/validation.strategy';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockMessageModel = {
    create: jest.fn(),
    get: jest.fn(),
    query: jest.fn(),
    update: jest.fn(),
  };

  // const mockQueryExec = {
  //   exec: jest.fn(),
  //   using: jest.fn().mockReturnThis(),
  //   eq: jest.fn().mockReturnThis(),
  //   query: jest.fn().mockReturnThis(),
  //   where: jest.fn().mockReturnThis(),
  //   between: jest.fn().mockReturnThis(),
  // };

  const mockValidationStrategy = {
    formatDate: jest.fn(),
    formatToYYYYMMDD: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: 'MESSAGEE_MODEL', useValue: mockMessageModel },
        { provide: ValidationStrategy, useValue: mockValidationStrategy },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);

    //limpa os mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a message and format date', async () => {
      const dto = { content: 'teste', sender: 'jackeline' };
      const createdAt = new Date();
      const createdBody = { ...dto, createdAt };

      mockMessageModel.create.mockResolvedValue(createdBody);
      mockValidationStrategy.formatDate.mockReturnValue('formatted-date');

      const result = await service.create(dto);

      expect(mockMessageModel.create).toHaveBeenCalledWith({
        content: dto.content,
        sender: dto.sender,
      });
      expect(mockValidationStrategy.formatDate).toHaveBeenCalledWith(createdAt);
      expect(result).toEqual({
        ...createdBody,
        createdAt: 'formatted-date',
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const dto = { content: 'teste', sender: 'jackeline' };
      mockMessageModel.create.mockRejectedValue(new Error('error'));

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findById', () => {
    it('should get a message by id and format date', async () => {
      const id = '123';
      const body = { id, createdAt: new Date(), content: 'teste', sender: 'jackeline' };
      mockMessageModel.get.mockResolvedValue(body);
      mockValidationStrategy.formatDate.mockReturnValue('formatted-date');

      const result = await service.findById(id);

      expect(mockMessageModel.get).toHaveBeenCalledWith({ id });
      expect(mockValidationStrategy.formatDate).toHaveBeenCalledWith(body.createdAt);
      expect(result).toEqual({
        ...body,
        createdAt: 'formatted-date',
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockMessageModel.get.mockRejectedValue(new Error('error'));

      await expect(service.findById('123')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findBySender', () => {
    it('should query messages by sender and format dates', async () => {
      const sender = 'jackeline';
      const messages = [
        { id: '1', createdAt: new Date(), content: 'teste1' },
        { id: '2', createdAt: new Date(), content: 'teste2' },
      ];

      // Mock do objeto em toJSON
      const mockQuery = {
        using: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          toJSON: () => messages,
        }),
      };

      mockMessageModel.query = jest.fn().mockReturnValue(mockQuery);
      mockValidationStrategy.formatDate.mockImplementation(date => 'formatted-date');

      const result = await service.findBySender(sender);

      expect(mockMessageModel.query).toHaveBeenCalledWith('sender');
      expect(mockQuery.using).toHaveBeenCalledWith('sender-index');
      expect(mockQuery.eq).toHaveBeenCalledWith(sender);
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(mockValidationStrategy.formatDate).toHaveBeenCalledTimes(messages.length);

      expect(result).toEqual(
        messages.map(msg => ({ ...msg, createdAt: 'formatted-date' }))
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const mockQuery = {
        using: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('error')),
      };

      mockMessageModel.query = jest.fn().mockReturnValue(mockQuery);

      await expect(service.findBySender('jackeline')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByPeriod', () => {
    it('should query messages by period and format dates', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const messages = [
        { id: '1', createdAt: new Date(), content: 'teste', status: 'enviado' },
      ];

      const mockQuery = {
        using: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        between: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          toJSON: () => messages,
        }),
      };

      mockMessageModel.query = jest.fn().mockReturnValue(mockQuery);
      mockValidationStrategy.formatToYYYYMMDD.mockImplementation(date => '2023-01-01');
      mockValidationStrategy.formatDate.mockImplementation(() => 'formatted-date');

      const result = await service.findByPeriod(startDate, endDate);

      expect(mockValidationStrategy.formatToYYYYMMDD).toHaveBeenCalledTimes(2);
      expect(mockValidationStrategy.formatToYYYYMMDD).toHaveBeenCalledWith(new Date(startDate));
      expect(mockValidationStrategy.formatToYYYYMMDD).toHaveBeenCalledWith(new Date(endDate));

      expect(mockMessageModel.query).toHaveBeenCalledWith('status');
      expect(mockQuery.eq).toHaveBeenCalledWith('enviado');
      expect(mockQuery.where).toHaveBeenCalledWith('createdAt');
      expect(mockQuery.between).toHaveBeenCalledWith('2023-01-01', '2023-01-01');
      expect(mockQuery.using).toHaveBeenCalledWith('status-createdAt-index');
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(mockValidationStrategy.formatDate).toHaveBeenCalledTimes(messages.length);

      expect(result).toEqual(messages.map(msg => ({ ...msg, createdAt: 'formatted-date' })));
    });

    it('should throw InternalServerErrorException on error', async () => {
      const mockQuery = {
        using: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        between: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('error')),
      };
      mockMessageModel.query = jest.fn().mockReturnValue(mockQuery);
      mockValidationStrategy.formatToYYYYMMDD.mockReturnValue('2023-01-01');

      await expect(service.findByPeriod('2023-01-01', '2023-01-31')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update message status and format date', async () => {
      const id = '123';
      const dto = { status: MessageStatus.LIDO };
      const body = { id, status: dto.status, createdAt: new Date() };

      mockMessageModel.update.mockResolvedValue(body);
      mockValidationStrategy.formatDate.mockReturnValue('formatted-date');

      const result = await service.update(id, dto);

      expect(mockMessageModel.update).toHaveBeenCalledWith(id, { status: dto.status });
      expect(mockValidationStrategy.formatDate).toHaveBeenCalledWith(body.createdAt);
      expect(result).toEqual({
        ...body,
        createdAt: 'formatted-date',
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockMessageModel.update.mockRejectedValue(new Error('error'));

      await expect(service.update('123', { status: MessageStatus.LIDO })).rejects.toThrow(InternalServerErrorException);
    });
  });
});
