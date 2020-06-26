import { expect } from 'chai';
import db from '../db';
import BikeService from '../services/bike.service';
import { DocumentData } from '@google-cloud/firestore';

describe('Bike service', () => {
    const bikeService = new BikeService(db);

    describe('#getAllBikes()', () => {
        it('should read all bikes without errors', (done) => {
            bikeService
                .getAllBikes()
                .then((bikes) => {
                    if (bikes.length == 0) {
                        done(false);
                    }
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#getBikeById()', () => {
        it('should read one bike by id', (done) => {
            bikeService
                .getBikeById('0kmWcO4n58w4PQ99EQin')
                .then((bike) => {
                    expect(bike).to.have.keys(['title', 'comments', 'status']);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#createBike()', () => {
        it('should create a stolen bike case and delete it', (done) => {
            bikeService
                .createBike({
                    title: 'Lorem ipsum dolor sit amet',
                    comments: 'My bike has been stolen',
                    status: 'Not Assigned',
                })
                .then((bike) => {
                    expect(bike).to.have.keys(['id', 'data']);
                    bikeService
                        .deleteBike(bike.id)
                        .then((result) => {
                            expect(result).to.be.string(`Bike with id ${bike.id} successfully deleted`);
                            done();
                        })
                        .catch((e) => {
                            done(e);
                        });
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#updateBike()', () => {
        it('should update a stolen bike without errors', (done) => {
            const updatedBike: DocumentData = { title: 'My stolen bike for test' };
            //TODO -  Should be updated for production because data in prod should no be updated by tests
            bikeService
                .updateBike('0kmWcO4n58w4PQ99EQin', updatedBike)
                .then((bike) => {
                    expect(bike).to.include({ title: updatedBike.title });
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#deleteBike()', () => {
        it('should create test bike and delete it', (done) => {
            const newBike: DocumentData = {
                title: 'Lorem ipsum dolor sit amet',
                comments: 'Test lorem',
                status: 'Not Assigned',
            };
            bikeService.createBike(newBike).then((createdBike) => {
                bikeService
                    .deleteBike(createdBike.id)
                    .then((result) => {
                        expect(result).to.be.string(`Bike with id ${createdBike.id} successfully deleted`);
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    });
            });
        });
    });

    describe('#assignBikeToPolice() - auto assign functionality', () => {
        it('should find array of available officers, change status of the first officer and bike to "Assigned"', (done) => {
            bikeService
                .assignBikeToPolice('0kmWcO4n58w4PQ99EQin')
                .then((result) => {
                    expect(result).to.be.an('array').that.to.have.lengthOf(2);
                    expect((result as [DocumentData, DocumentData]).map((e) => e.status)).to.include('Assigned');
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });
});
