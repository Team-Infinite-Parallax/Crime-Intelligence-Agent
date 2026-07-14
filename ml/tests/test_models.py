import unittest
import pandas as pd
import numpy as np
from ml.models import (
    HotspotPredictor,
    DistrictRiskScorer,
    AnomalyDetector,
    CaseOutcomePredictor
)

class TestMLModels(unittest.TestCase):
    def setUp(self):
        # Create standard synthetic data for testing
        np.random.seed(42)
        self.n_samples = 20
        
        # Spatial classification mock dataset
        self.X_spatial = pd.DataFrame({
            'latitude': np.random.uniform(12.0, 14.5, self.n_samples),
            'longitude': np.random.uniform(74.0, 77.8, self.n_samples),
            'hour': np.random.randint(0, 24, self.n_samples),
            'day_of_week': np.random.randint(0, 7, self.n_samples),
            'crime_type_encoded': np.random.randint(0, 5, self.n_samples),
            'grid_lat': np.random.uniform(12.0, 14.5, self.n_samples),
            'grid_lon': np.random.uniform(74.0, 77.8, self.n_samples),
        })
        self.y_spatial = np.random.randint(0, 2, self.n_samples)

        # Risk regression mock dataset
        self.X_risk = pd.DataFrame({
            'DistrictID': np.random.randint(1, 6, self.n_samples),
            'unemployment_rate': np.random.uniform(0.02, 0.15, self.n_samples),
            'poverty_index': np.random.uniform(0.05, 0.40, self.n_samples),
            'literacy_rate': np.random.uniform(0.60, 0.95, self.n_samples),
            'police_station_count': np.random.randint(2, 20, self.n_samples),
            'prior_month_crime_count': np.random.randint(10, 150, self.n_samples)
        })
        self.y_risk = np.random.uniform(1.0, 10.0, self.n_samples)

        # Case outcome prediction mock dataset
        self.X_outcome = pd.DataFrame({
            'arrest_duration_days': np.random.uniform(0, 60, self.n_samples),
            'witness_count': np.random.randint(1, 10, self.n_samples),
            'evidence_items_count': np.random.randint(1, 15, self.n_samples),
            'heinous_crime': np.random.randint(0, 2, self.n_samples),
            'offender_age': np.random.randint(18, 70, self.n_samples)
        })
        # y needs classes 0, 1, 2 for ordinal outcomes (chargesheet types)
        self.y_outcome = np.random.choice([0, 1, 2], size=self.n_samples)

    def test_hotspot_predictor(self):
        predictor = HotspotPredictor()
        predictor.fit(self.X_spatial, self.y_spatial)
        
        preds = predictor.predict(self.X_spatial)
        self.assertEqual(len(preds), self.n_samples)
        
        # Check dictionary schema
        first = preds[0]
        self.assertIn('is_hotspot', first)
        self.assertIn('hotspot_probability', first)
        self.assertIn('risk_level', first)
        self.assertIn('grid', first)
        self.assertIn('lat', first['grid'])
        self.assertIn('lon', first['grid'])
        self.assertIsInstance(first['is_hotspot'], bool)

    def test_district_risk_scorer(self):
        scorer = DistrictRiskScorer()
        scorer.fit(self.X_risk, self.y_risk)
        
        preds = scorer.predict(self.X_risk)
        self.assertEqual(len(preds), self.n_samples)
        
        # Check dictionary schema
        first = preds[0]
        self.assertIn('district_id', first)
        self.assertIn('risk_score', first)
        self.assertIn('risk_tier', first)
        self.assertIn('top_drivers', first)
        self.assertIsInstance(first['risk_score'], float)

    def test_anomaly_detector(self):
        detector = AnomalyDetector()
        detector.fit(self.X_spatial) # Unsupervised
        
        preds = detector.predict(self.X_spatial)
        self.assertEqual(len(preds), self.n_samples)
        
        # Check dictionary schema
        first = preds[0]
        self.assertIn('case_id', first)
        self.assertIn('anomaly_score', first)
        self.assertIn('is_anomaly', first)
        self.assertIn('anomaly_type', first)
        self.assertIn('anomaly_label', first)
        self.assertIsInstance(first['is_anomaly'], (bool, np.bool_))

    def test_case_outcome_predictor(self):
        predictor = CaseOutcomePredictor()
        predictor.fit(self.X_outcome, self.y_outcome)
        
        preds = predictor.predict(self.X_outcome)
        self.assertEqual(len(preds), self.n_samples)
        
        # Check dictionary schema
        first = preds[0]
        self.assertIn('case_id', first)
        self.assertIn('predicted_outcome', first)
        self.assertIn('outcome_probabilities', first)
        self.assertIn('confidence', first)
        self.assertIsInstance(first['confidence'], float)

if __name__ == '__main__':
    unittest.main()
