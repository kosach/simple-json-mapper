import { mapper } from '../index';

it('should return correct simple obj', () => {
    const result = {
      firstName: 'Test',
      lastName: 'TestLastname',
    };
    const sourceObject = {
      personalData: {
        firstName: 'Test',
        lastName: 'TestLastname',
      },
    };
    const map = {
      firstName: 'personalData.firstName',
      lastName: 'personalData.lastName',
    };
    expect(mapper(sourceObject, map)).toMatchObject(result);
  });
  