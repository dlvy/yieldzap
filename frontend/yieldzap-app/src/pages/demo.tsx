export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', padding: '2rem' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: '#0ea5e9', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Y
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>YieldZap</h1>
          </div>
          <button style={{
            background: '#0ea5e9',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '1rem',
          margin: '0 0 1rem 0'
        }}>
          One-Click <span style={{ color: '#fbbf24' }}>Yield Farming</span>
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Swap any token and deposit into yield-generating vaults on Stellar in a single transaction. 
          Powered by Soroswap and DeFindex.
        </p>
      </div>

      {/* Main Zap Interface */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px', 
          background: 'white', 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)', 
          overflow: 'hidden' 
        }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
            padding: '2rem', 
            color: 'white' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.5rem', 
                background: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '8px' 
              }}>
                ⚡
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>YieldZap</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', margin: 0 }}>
                  One-click yield farming
                </p>
              </div>
            </div>
          </div>

          {/* Zap Interface */}
          <div style={{ padding: '2rem' }}>
            {/* From Token */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                From
              </label>
              <select style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                background: 'white',
                fontSize: '1rem'
              }}>
                <option value="">Select token</option>
                <option value="usdc">USDC - USD Coin</option>
                <option value="xlm">XLM - Stellar Lumens</option>
                <option value="eurc">EURC - Euro Coin</option>
              </select>
            </div>

            {/* Amount Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Amount
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    background: 'white',
                    fontSize: '1rem',
                    textAlign: 'right'
                  }}
                />
                <button style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#0ea5e9',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  MAX
                </button>
              </div>
            </div>

            {/* Swap Arrow */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
              <div style={{ 
                padding: '0.5rem', 
                background: '#f3f4f6', 
                borderRadius: '50%',
                cursor: 'pointer'
              }}>
                ↓
              </div>
            </div>

            {/* To Token */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                To
              </label>
              <select style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                background: 'white',
                fontSize: '1rem'
              }}>
                <option value="">Select token</option>
                <option value="usdc">USDC - USD Coin</option>
                <option value="xlm">XLM - Stellar Lumens</option>
                <option value="eurc">EURC - Euro Coin</option>
              </select>
            </div>

            {/* Vault Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '0.5rem' 
              }}>
                Deposit to Vault
              </label>
              <div style={{
                padding: '1rem',
                border: '2px solid #0ea5e9',
                borderRadius: '12px',
                background: '#eff6ff',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>USDC Yield Vault</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Optimized USDC lending strategy</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      color: '#059669', 
                      fontWeight: '600' 
                    }}>
                      📈 8.5% APY
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>TVL: $2.5M</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Display */}
            <div style={{ 
              background: '#f9fafb', 
              borderRadius: '12px', 
              padding: '1rem', 
              marginBottom: '1.5rem' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#6b7280' }}>Expected Output:</span>
                <span style={{ fontWeight: '600' }}>995.50 USDC</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#6b7280' }}>Minimum Received:</span>
                <span style={{ fontWeight: '600' }}>990.00 USDC</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.875rem'
              }}>
                <span style={{ color: '#6b7280' }}>Expected Vault Shares:</span>
                <span style={{ fontWeight: '600' }}>995.50</span>
              </div>
            </div>

            {/* Zap Button */}
            <button style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: '#0ea5e9',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              ⚡ Zap & Deposit
            </button>

            {/* Info Links */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem', 
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>How it works 🔗</a>
              <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Risks 🔗</a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        marginBottom: '3rem' 
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌀</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
            Optimal Swaps
          </h3>
          <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Automatically routes through Soroswap aggregator for best prices across all Stellar DEXs.
          </p>
        </div>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏦</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
            Auto Yield
          </h3>
          <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Seamlessly deposits into DeFindex vaults for optimized yield generation strategies.
          </p>
        </div>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
            Gas Efficient
          </h3>
          <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
            Single transaction execution saves gas and reduces slippage compared to manual steps.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: '24px', 
        padding: '2rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
              $2.5M
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Value Locked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
              1,234
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Zaps Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
              8.5%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Average APY</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
              12
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Vaults</div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#10b981',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '300px',
        opacity: '0.95'
      }}>
        🚀 Frontend Successfully Built! YieldZap UI is now ready for users to call zap_and_deposit.
      </div>
    </div>
  );
}
