<template>
  <div class="restocking">
    <div class="page-header">
      <div class="header-row">
        <div>
          <h2>{{ t('restocking.title') }}</h2>
          <p>{{ t('restocking.description') }}</p>
        </div>
        <div class="budget-input">
          <label>{{ t('restocking.budgetCeiling') }}</label>
          <div class="input-wrapper">
            <span class="currency">$</span>
            <input
              type="number"
              v-model.number="budget"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.totalRecommendations') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">{{ t('restocking.estimatedTotalCost') }}</div>
          <div class="stat-value">${{ formatNumber(estimatedTotalCost) }}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">{{ t('restocking.itemsBelowReorder') }}</div>
          <div class="stat-value">{{ itemsBelowReorder }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">{{ t('restocking.budgetRemaining') }}</div>
          <div class="stat-value">${{ formatNumber(budgetRemaining) }}</div>
        </div>
      </div>

      <div class="card">
        <div v-if="recommendations.length === 0" class="no-data">
          {{ t('restocking.noRecommendations') }}
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.itemName') }}</th>
                <th>{{ t('inventory.table.category') }}</th>
                <th>{{ t('inventory.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('dashboard.inventoryShortages.priority') }}</th>
                <th>{{ t('restocking.table.demandTrend') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku + item.warehouse">
                <td><code>{{ item.sku }}</code></td>
                <td>{{ translateProductName(item.name) }}</td>
                <td>{{ item.category }}</td>
                <td>{{ translateWarehouse(item.warehouse) }}</td>
                <td :class="{ 'low-stock': item.quantity_on_hand <= item.reorder_point }">
                  {{ item.quantity_on_hand }}
                </td>
                <td>{{ item.reorder_point }}</td>
                <td><strong>{{ item.recommended_quantity }}</strong></td>
                <td>${{ formatNumber(item.estimated_cost) }}</td>
                <td><span :class="'badge ' + item.priority">{{ t('priority.' + item.priority) }}</span></td>
                <td><span :class="'badge ' + item.demand_trend">{{ t('trends.' + item.demand_trend) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t, translateProductName, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const budget = ref(50000)
    const recommendations = ref([])

    let debounceTimer = null

    const estimatedTotalCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )
    const itemsBelowReorder = computed(() =>
      recommendations.value.filter(r => r.quantity_on_hand <= r.reorder_point).length
    )
    const budgetRemaining = computed(() =>
      Math.max(budget.value - estimatedTotalCost.value, 0)
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations({
          budget: budget.value,
          warehouse: filters.warehouse,
          category: filters.category
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadData)

    watch(budget, () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(loadData, 300)
    })

    const formatNumber = (num) =>
      Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    onMounted(loadData)

    return {
      t, translateProductName, translateWarehouse,
      loading, error, budget, recommendations,
      estimatedTotalCost, itemsBelowReorder, budgetRemaining,
      formatNumber
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.budget-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 200px;
}

.budget-input label {
  font-size: 0.813rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.currency {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  border-right: 1px solid #e2e8f0;
}

.input-wrapper input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.938rem;
  font-weight: 600;
  color: #0f172a;
  width: 100%;
  background: white;
}

.input-wrapper input:focus {
  background: #f8fafc;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 0.938rem;
}

.low-stock {
  color: #dc2626;
  font-weight: 600;
}

code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.813rem;
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  color: #334155;
}
</style>
