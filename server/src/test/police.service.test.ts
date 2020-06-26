import { expect } from 'chai';
import PoliceService from '../services/police.service';
import db from '../db';
import { DocumentData } from '@google-cloud/firestore';

describe('Police service', () => {
    const policeService = new PoliceService(db);

    describe('#createPoliceOfficer()', () => {
        it('should create a new police officer and delete it', (done) => {
            policeService
                .createPoliceOfficer({
                    firstName: 'John',
                    lastName: 'Doe',
                    status: 'Not Assigned',
                })
                .then((officer) => {
                    expect(officer).to.have.keys(['id', 'data']);
                    policeService
                        .deletePoliceOfficer(officer.id)
                        .then((result) => {
                            expect(result).to.be.string(`Police officer with id ${officer.id} successfully deleted`);
                            done();
                        })
                        .catch((e) => {
                            done(e);
                        });
                });
        });
    });

    describe('#getPoliceOfficerById()', () => {
        it('should return officer by id', (done) => {
            policeService
                .getPoliceOfficerById('9kXKTwXyEoduGwcbTiTf')
                .then((officer) => {
                    expect(officer).to.be.an('Object');
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#updatePoliceOfficer()', () => {
        it('should return updated officer without errors', (done) => {
            const updatedOfficer: DocumentData = { lastName: 'Test' };
            //TODO -  Should be updated for production because data in prod should no be updated by tests
            policeService
                .updatePoliceOfficer('9kXKTwXyEoduGwcbTiTf', updatedOfficer)
                .then((officer) => {
                    expect(officer).to.include({ lastName: updatedOfficer.lastName });
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#getAllNotAssignedPoliceOfficers()', () => {
        it('should return array of not assigned police officers without errors', (done) => {
            policeService
                .getAllNotAssignedPoliceOfficers()
                .then((officers) => {
                    if (officers.length == 0) {
                        done(false);
                    }
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });

    describe('#deletePoliceOfficer()', () => {
        it('should create test officer and delete without errors', (done) => {
            const newOfficer: DocumentData = {
                firstName: 'John',
                lastName: 'Doe',
                status: 'Not Assigned',
            };
            policeService.createPoliceOfficer(newOfficer).then((officer) => {
                policeService
                    .deletePoliceOfficer(officer.id)
                    .then((result) => {
                        expect(result).to.be.string(`Police officer with id ${officer.id} successfully deleted`);
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    });
            });
        });
    });

    describe('#resolveBikeCase()', () => {
        it(
            'should resolve stolen bike case and automatically find new not assigned bike case ' +
                'and assign first found not assigned bike case to available officer',
            (done) => {
                policeService
                    .resolveBikeCase('2glDARDuhczMwek7kZZy', 'qpYuUDJZCs8RfpCHeXUE')
                    .then((result) => {
                        if (!Array.isArray(result)) {
                            expect(result as DocumentData).to.include({ status: 'Resolved' });
                        }
                        if (Array.isArray(result)) {
                            expect(result as [DocumentData, DocumentData]).to.have.lengthOf(2);
                            expect((result as [DocumentData, DocumentData]).map((e) => e.status)).to.include(
                                'Assigned',
                            );
                        }
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    });
            },
        );
    });
});
